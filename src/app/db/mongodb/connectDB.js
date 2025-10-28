import dotenv from "dotenv";
import mongoose from "mongoose";
import { DB_NAME, MONGODB_URI } from "../../config/env.js";
dotenv.config();

const MONGO_URI = MONGODB_URI + "/" + DB_NAME;

export const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      console.log("MONGO_URI is not defined in environment variables");
      return;
    }
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};
