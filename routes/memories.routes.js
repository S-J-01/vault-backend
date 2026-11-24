import { Router } from "express";
import {
  createMemory,
  fetchAllMemories,
  getMemoryById,
  fetchAllTags,
  findMemoriesByTag,
  updateMemory,
  deleteMemory,
} from "../controllers/memories.controllers.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { memoriesRateLimit } from "../middleware/memoriesRateLimit.js";
import {
  createMemoryExport,
  getMemoryExport,
  downloadMemoryExport,
} from "../controllers/memoryExports.controllers.js";

export const router = Router();

router.use(requireAuth);
router.use(memoriesRateLimit);

router.post("/exports", asyncHandler(createMemoryExport));
router.get("/exports/:jobId/download", asyncHandler(downloadMemoryExport));
router.get("/exports/:jobId", asyncHandler(getMemoryExport));
router.post("/", asyncHandler(createMemory));
router.get("/", asyncHandler(fetchAllMemories));
router.get("/tags", asyncHandler(fetchAllTags));
router.get("/search", asyncHandler(findMemoriesByTag));
router.get("/:id", asyncHandler(getMemoryById));
router.put("/:id", asyncHandler(updateMemory));
router.delete("/:id", asyncHandler(deleteMemory));
