import "dotenv/config";
import { Queue } from "bullmq";

const redisUrl = new URL(process.env.REDIS_URL || "redis://127.0.0.1:6379");

export const memoryExportQueue = new Queue("memory-exports", {
  connection: {
    host: redisUrl.hostname,
    port: Number(redisUrl.port) || 6379,
    username: redisUrl.username || undefined,
    password: redisUrl.password || undefined,
    ...(redisUrl.protocol === "rediss:" ? { tls: {} } : {}),
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: { age: 86400, count: 1000 },
    removeOnFail: { age: 604800, count: 1000 },
  },
});
