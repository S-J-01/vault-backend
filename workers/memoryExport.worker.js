import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Worker } from "bullmq";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Memory } from "../models/memories.models.js";

dotenv.config();

const redisUrl = new URL(process.env.REDIS_URL || "redis://127.0.0.1:6379");
const exportDirectory = resolve("exports");

const start = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await mkdir(exportDirectory, { recursive: true });

  const worker = new Worker(
    "memory-exports",
    async (job) => {
      const memories = await Memory.find({}).lean();
      const fileName = `memories-${job.id}.json`;
      await writeFile(
        resolve(exportDirectory, fileName),
        JSON.stringify(memories, null, 2),
      );
      return { fileName, count: memories.length };
    },
    {
      connection: {
        host: redisUrl.hostname,
        port: Number(redisUrl.port) || 6379,
        username: redisUrl.username || undefined,
        password: redisUrl.password || undefined,
        ...(redisUrl.protocol === "rediss:" ? { tls: {} } : {}),
      },
    },
  );

  worker.on("completed", (job) => {
    console.log(`memory export ${job.id} completed`);
  });
  worker.on("failed", (job, error) => {
    console.error(`memory export ${job?.id} failed`, error);
  });
};

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
