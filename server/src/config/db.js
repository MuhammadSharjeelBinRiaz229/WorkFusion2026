import mongoose from "mongoose";
import { logger } from "../utils/logger.js";

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/workfusion";
  try {
    await mongoose.connect(uri);
    logger.info("Successfully connected to MongoDB database.");
  } catch (error) {
    logger.error(`Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
