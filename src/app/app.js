import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { userRouter } from "../api/v1/modules/users/routes/user.routes.js";
import { errorMiddleware } from "../api/v1/common/middlewares/error.middleware.js";
import { CORS_ORIGIN } from "./config/env.js";
import { ApiError } from "../api/v1/common/utils/apiError.js";

export const app = express();

// middlewares
app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// ✅ Health check route — place before main routes
app.get("/", (req, res) => {
  res.send("🚀 Express server running!");
});

// ✅ API routes
app.use("/api/v1/users", userRouter);

// ✅ Catch-all for unmatched routes (Express 5 safe)
app.use((req, res, next) => {
  next(new ApiError(`Route not found: ${req.originalUrl}`, 404));
});

// Global error handler — should be last
app.use(errorMiddleware);
