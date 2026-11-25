import dotenv from "dotenv";
import mongoose from "mongoose";
import { Memory } from "../models/memories.models.js";

dotenv.config();

const migrate = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const result = await Memory.updateMany(
    { ownerId: { $exists: false } },
    { $set: { ownerId: process.env.AUTH_USER_ID || "default" } },
  );
  console.log(`assigned owner to ${result.modifiedCount} memories`);
  await mongoose.disconnect();
};

migrate().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
