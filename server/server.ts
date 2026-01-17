import express from "express";
import http from "http";
import { Server } from "socket.io";
import index_router from "./src/route/index.ts";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

const port = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  }),
);
app.get("/health", (req, res) => {
  res.status(200).json({ health: "ok" });
});

app.use("/v1", index_router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
