// This file is to contain all the routes detail of the server
// Ex : "/chat", "/user" and etc.
import express, { type Request, type Response } from "express";
import ai_router from "./chat.ts";
import auth_router from "./auth.ts";
import { authorize } from "../middleware/auth-middleware.ts";

const index_router = express.Router();

index_router
  .use("/ai", authorize, ai_router)
  .use("/auth", auth_router)
  .use("/test", authorize, (req: Request, res: Response) => {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.json({
      message: "Authorized",
      userId: req.userId,
    });
  });

export default index_router;
