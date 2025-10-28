import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { userRouter } from "../api/v1/modules/users/routes/user.routes.js";

export const app = express();

// middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// routes
app.use("/api/v1/users", userRouter);

app.get("/", (req, res) => {
  res.send("🚀 Express server running!");
});
