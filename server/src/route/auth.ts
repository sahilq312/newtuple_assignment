import express from "express";
import { Login, Signup } from "../controller/auth.ts";

const auth_router = express.Router();

auth_router.post("/login", Login).post("/signup", Signup);

export default auth_router;
