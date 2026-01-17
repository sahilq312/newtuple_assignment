import express from "express";
import { chatHandler, getChatHistory } from "../controller/chat.ts";

const ai_router = express.Router();

ai_router.post("/chat", chatHandler).get("/chat/history", getChatHistory);

export default ai_router;
