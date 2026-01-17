import { type Request, type Response } from "express";
import type { ChatMessage } from "../../types";
import OpenAI from "openai";
import "dotenv/config";
import { db } from "../..";
import { messageSession } from "../db/schema";
import { eq } from "drizzle-orm";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

type ClientMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

const chatHandler = async (req: Request, res: Response) => {
  const { prompt, history } = req.body as {
    prompt: string;
    history: ClientMessage[];
  };

  // --- SSE HEADERS ---
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  // 🚨 IMPORTANT: strip IDs before sending to OpenAI
  const messages: ClientMessage[] = [
    ...history.map((m) => ({
      role: m.role,
      content: m.content,
    })),
    { role: "user", content: prompt },
  ];

  try {
    const stream = await openai.responses.stream({
      model: "gpt-4.1-mini",
      input: messages,
    });

    for await (const event of stream) {
      if (event.type === "response.output_text.delta") {
        res.write(event.delta); // raw chunk
      }

      if (event.type === "response.completed") {
        res.write("\n"); // clean termination
        res.end();
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.write(`\n[ERROR]: ${message}`);
    res.end();
  }
};

const getChatHistory = async (req: Request, res: Response) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const chatHistory = await db
      .select()
      .from(messageSession)
      .where(eq(messageSession.userId, userId));

    return res.status(200).json({
      success: true,
      data: chatHistory,
      message:
        chatHistory.length > 0
          ? "Chat history fetched successfully"
          : "No chat sessions found for this user",
    });
  } catch (error) {
    console.error("Get chat history error:", error);

    return res.status(500).json({
      success: false,
      data: [],
      message: "Failed to fetch chat history",
    });
  }
};

export { chatHandler, getChatHistory };
