import { Socket } from "socket.io";
import OpenAI from "openai";
import { db } from "../../index";
import { message, messageSession } from "../db/schema";
import { setTitle } from "../lib/openai-vendor";
import "dotenv/config";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY as string,
});

type ClientMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export const handleChatSocket = (socket: Socket) => {
  const userId = (socket as any).userId;

  if (!userId) {
    console.log("Socket: Connection without userId rejected/ignored");
    return;
  }

  socket.join(`user:${userId}`);

  socket.on(
    "chat:message",
    async (data: {
      prompt: string;
      history: ClientMessage[];
      sessionId?: number;
    }) => {
      const { prompt, history, sessionId } = data;
      let activeSessionId = sessionId;

      console.log(
        `Socket: Message received from user ${userId} for session ${sessionId}`,
      );

      try {
        if (!activeSessionId) {
          const title = await setTitle(prompt);
          const [newSession] = await db
            .insert(messageSession)
            .values({
              userId,
              title,
            })
            .returning({ id: messageSession.id });

          activeSessionId = newSession!.id;
          socket.emit("session:created", { sessionId: activeSessionId });
        }

        await db.insert(message).values({
          sessionId: activeSessionId!,
          role: "user",
          content: prompt,
        });

        const messages: ClientMessage[] = [
          ...history.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          { role: "user", content: prompt },
        ];

        let assistantContent = "";
        let chunkCount = 0;

        // @ts-ignore
        const stream = await openai.responses.stream({
          model: "gpt-4.1-mini",
          input: messages,
        });

        for await (const event of stream) {
          if (event.type === "response.output_text.delta") {
            assistantContent += event.delta;
            // Emitting chunk to client
            socket.emit("chat:token", {
              chunk: event.delta,
              sessionId: activeSessionId,
            });
            chunkCount++;
          }
          if (event.type === "response.completed") {
            break;
          }
        }

        await db.insert(message).values({
          sessionId: activeSessionId!,
          role: "assistant",
          content: assistantContent,
        });

        socket.emit("chat:completed", { sessionId: activeSessionId });
      } catch (err: any) {
        console.error("Socket chat error:", err);
        socket.emit("chat:error", { message: err.message || "Unknown error" });
      }
    },
  );
};
