import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { memoryExportQueue } from "../queues/memoryExport.queue.js";
import { HttpError } from "../middleware/errorHandler.js";

const exportDirectory = resolve("exports");

export const createMemoryExport = async (req, res) => {
  const job = await memoryExportQueue.add("create", {
    ownerId: req.user.id,
  });
  res.status(202).json({
    jobId: job.id,
    statusUrl: `/api/v1/memories/exports/${job.id}`,
  });
};

export const getMemoryExport = async (req, res) => {
  const job = await memoryExportQueue.getJob(req.params.jobId);
  if (!job || job.data.ownerId !== req.user.id) {
    throw new HttpError(404, "export job not found");
  }

  const state = await job.getState();
  const response = { jobId: job.id, state };
  if (state === "completed") {
    response.downloadUrl = `/api/v1/memories/exports/${job.id}/download`;
  }
  if (state === "failed") {
    response.error = job.failedReason;
  }
  res.status(200).json(response);
};

export const downloadMemoryExport = async (req, res) => {
  const job = await memoryExportQueue.getJob(req.params.jobId);
  if (!job || job.data.ownerId !== req.user.id) {
    throw new HttpError(404, "export job not found");
  }
  if ((await job.getState()) !== "completed" || !job.returnvalue?.fileName) {
    throw new HttpError(409, "export is not ready");
  }

  const filePath = resolve(exportDirectory, job.returnvalue.fileName);
  if (!filePath.startsWith(`${exportDirectory}/`)) {
    throw new HttpError(400, "invalid export file");
  }
  const file = await readFile(filePath);
  res.type("application/json").attachment(job.returnvalue.fileName).send(file);
};
