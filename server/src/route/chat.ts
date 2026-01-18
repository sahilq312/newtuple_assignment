import express from "express";
import {
  chatHandler,
  getChatHistory,
  getChatSession,
} from "../controller/chat.ts";

const ai_router = express.Router();

ai_router
  .post("/chat", chatHandler)
  .get("/chat/history", getChatHistory)
  .get("/chat/:session_id", getChatSession);

export default ai_router;
