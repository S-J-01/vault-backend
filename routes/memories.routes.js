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

export const router = Router();

router.use(requireAuth);

router.post("/", asyncHandler(createMemory));
router.get("/", asyncHandler(fetchAllMemories));
router.get("/tags", asyncHandler(fetchAllTags));
router.get("/search", asyncHandler(findMemoriesByTag));
router.get("/:id", asyncHandler(getMemoryById));
router.put("/:id", asyncHandler(updateMemory));
router.delete("/:id", asyncHandler(deleteMemory));
