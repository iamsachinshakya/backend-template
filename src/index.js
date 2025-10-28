// src/index.js
import { app } from "./app/app.js";
import { connectDB } from "./app/db/mongodb/connectDB.js";
import { PORT } from "./app/config/env.js";

/**
 * 🧩 Handle uncaught synchronous exceptions
 * These happen outside of promises and can crash the app immediately.
 */
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception! Shutting down...");
  console.error(err);
  process.exit(1);
});

// ✅ Start server only after successful DB connection
const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    /**
     * 🧩 Handle unhandled promise rejections
     * For example: failed DB connection or network error not caught.
     */
    process.on("unhandledRejection", (err) => {
      console.error("💥 Unhandled Rejection! Shutting down...");
      console.error(err);

      // Gracefully close server before exiting
      server.close(() => process.exit(1));
    });

    /**
     * 🧩 Handle SIGTERM (graceful shutdown)
     * Useful for production (e.g., Docker, PM2, etc.)
     */
    process.on("SIGTERM", () => {
      console.log("👋 SIGTERM RECEIVED. Shutting down gracefully...");
      server.close(() => {
        console.log("💤 Process terminated!");
      });
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1);
  }
};

startServer();
