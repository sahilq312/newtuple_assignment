import express from "express";
import http from "http";
import { Server } from "socket.io";
import index_router from "./src/route/index.ts";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { verifyToken } from "./src/middleware/auth-middleware";
import { handleChatSocket } from "./src/socket/handler";

const port = process.env.PORT || 8000;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true
  },
  transports: ["websocket", "polling"]
});

// Helper to parse cookies
function parseCookies(cookieString: string) {
  const list: any = {};
  if (!cookieString) return list;
  cookieString.split(';').forEach(function (cookie) {
    const parts = cookie.split('=');
    list[parts.shift()!.trim()] = decodeURI(parts.join('='));
  });
  return list;
}

io.use((socket, next) => {
  try {
    const cookieHeader = socket.request.headers.cookie;
    const cookies = parseCookies(cookieHeader || "");
    const token = cookies.access_token;

    if (token) {
      const userId = verifyToken(token);
      if (userId) {
        (socket as any).userId = userId;
        return next();
      }
    }
    return next(new Error("Authentication error"));
  } catch (e) {
    return next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  handleChatSocket(socket);
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

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
