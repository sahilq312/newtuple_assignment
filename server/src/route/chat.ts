import express from "express";
import {
  chatHandler,
  getChatHistory,
  getChatSession,
  deleteChatHandler
} from "../controller/chat.ts";

const ai_router = express.Router();

ai_router
  .post("/chat", chatHandler)
  .get("/chat/history", getChatHistory)
  .get("/chat/:session_id", getChatSession)
  .delete("/chat/:session_id", deleteChatHandler);

export default ai_router;
