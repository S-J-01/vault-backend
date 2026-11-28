import { mkdir, readdir, stat, unlink, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { Worker } from "bullmq";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Memory } from "../models/memories.models.js";
import {
  memoryExportQueue,
  memoryExportRetentionMs,
} from "../queues/memoryExport.queue.js";

dotenv.config();

const redisUrl = new URL(process.env.REDIS_URL || "redis://127.0.0.1:6379");
const exportDirectory = resolve("exports");

const cleanupExpiredExports = async () => {
  const cutoff = Date.now() - memoryExportRetentionMs;
  const files = await readdir(exportDirectory);
  let removedCount = 0;

  for (const fileName of files) {
    const match = /^memories-(.+)\.json$/.exec(fileName);
    if (!match) {
      continue;
    }

    const filePath = resolve(exportDirectory, fileName);
    const fileStats = await stat(filePath);
    if (fileStats.mtimeMs > cutoff) {
      continue;
    }

    const job = await memoryExportQueue.getJob(match[1]);
    if (job && (await job.getState()) !== "completed") {
      continue;
    }
    if (job) {
      await job.remove();
    }
    await unlink(filePath);
    removedCount += 1;
  }

  console.log(`removed ${removedCount} expired memory exports`);
};

const start = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  await mkdir(exportDirectory, { recursive: true });
  await memoryExportQueue.upsertJobScheduler(
    "memory-export-file-cleanup",
    { every: 60 * 60 * 1000 },
    { name: "cleanup", data: {} },
  );

  const worker = new Worker(
    "memory-exports",
    async (job) => {
      if (job.name === "cleanup") {
        await cleanupExpiredExports();
        return;
      }
      if (!job.data.ownerId) {
        throw new Error("export job is missing an owner");
      }
      const memories = await Memory.find({ ownerId: job.data.ownerId }).lean();
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
