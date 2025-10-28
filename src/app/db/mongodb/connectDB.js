import mongoose from "mongoose";
import { DB_NAME, MONGODB_URI } from "../../config/env.js";

export const connectDB = async () => {
  const MONGO_URI = `${MONGODB_URI}/${DB_NAME}`;

  if (!MONGODB_URI || !DB_NAME) {
    throw new Error("❌ Missing MongoDB connection environment variables");
  }

  try {
    await mongoose.connect(MONGO_URI);

    console.log("✅ MongoDB connected");

    console.log(
      `📦 DB: ${mongoose.connection.name} | 🌍 Host: ${mongoose.connection.host}`
    );

    // Handle DB-level errors
    mongoose.connection.on("error", (err) => {
      console.error("💥 MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB disconnected. Retrying...");
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    throw err; // Let index.js handle graceful shutdown
  }
};
