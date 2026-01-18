import { type Request, type Response } from "express";
import "dotenv/config";
import { db } from "../..";
import { message, messageSession } from "../db/schema";
import { and, asc, desc, eq } from "drizzle-orm";




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
      .where(eq(messageSession.userId, userId))
      .orderBy(desc(messageSession.createdAt));

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

const getChatSession = async (req: Request, res: Response) => {
  const sessionId = Number(req.params.session_id);
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!sessionId) {
    return res.status(400).json({ error: "Invalid session id" });
  }

  try {
    const sessionRows = await db
      .select()
      .from(messageSession)
      .where(
        and(
          eq(messageSession.id, sessionId),
          eq(messageSession.userId, userId),
        ),
      )
      .limit(1);

    const session = sessionRows[0];

    if (!session) {
      return res.status(404).json({ error: "Chat session not found" });
    }

    const messages = await db
      .select({
        id: message.id,
        role: message.role,
        content: message.content,
        createdAt: message.createdAt,
      })
      .from(message)
      .where(eq(message.sessionId, sessionId))
      .orderBy(asc(message.createdAt));

    return res.json({
      session: {
        id: session.id,
        title: session.title,
        createdAt: session.createdAt,
      },
      messages,
    });
  } catch (error) {
    console.error("getChatSession error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteChatHandler = async (req: Request, res: Response) => {
  try {
    const sessionId = Number(req.params.session_id);
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!sessionId) {
      return res.status(400).json({ error: "Invalid session id" });
    }

    await db
      .delete(messageSession)
      .where(
        and(
          eq(messageSession.id, sessionId),
          eq(messageSession.userId, userId),
        ),
      );

    return res.json({ success: true, message: "Chat session deleted successfully" });
  } catch (error) {
    console.error("Delete chat error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export { getChatHistory, getChatSession, deleteChatHandler };
