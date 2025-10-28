import mongoose from "mongoose";
import dotenv from "dotenv";
import { DB_NAME, MONGODB_URI } from "../../config/env.js";

// ✅ Load .env
dotenv.config();

const MONGO_URI = MONGODB_URI + "/" + DB_NAME;

/**
 * Generic seed function
 * @param {mongoose.Model} model - The Mongoose model to seed
 * @param {Array<Object>} data - Array of documents to insert
 * @param {string} name - Human-readable name for logs
 * @param {boolean} reset - Whether to clear existing data before seeding
 */
export const seedCollection = async (
  model,
  data,
  name = "Collection",
  reset = true
) => {
  try {
    if (reset) {
      await model.deleteMany();
      console.log(`🗑️ Cleared existing ${name} data.`);
    }

    await model.insertMany(data);
    console.log(`✅ Seeded ${data.length} ${name} record(s) successfully.`);
  } catch (err) {
    console.error(`❌ Error seeding ${name}:`, err.message);
    throw err;
  }
};

/**
 * Entry function for seeding multiple collections
 * Pass any number of { model, data, name } objects here.
 */
export const runSeed = async (seeds = []) => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("🌿 Connected to MongoDB...");

    for (const { model, data, name, reset } of seeds) {
      await seedCollection(model, data, name, reset);
    }

    console.log("🎉 All seed operations completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed process failed:", err);
    process.exit(1);
  }
};
