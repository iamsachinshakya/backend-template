import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { userRouter } from "../api/v1/modules/users/routes/user.routes.js";
import { errorMiddleware } from "../api/v1/common/middlewares/error.middleware.js";

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

// Global error handler — should be last
app.use(errorMiddleware);

app.get("/", (req, res) => {
  res.send("🚀 Express server running!");
});
