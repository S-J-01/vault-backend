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
export const router = Router();

router.use(requireAuth);

router.post("/", createMemory);
router.get("/", fetchAllMemories);
router.get("/tags", fetchAllTags);
router.get("/search", findMemoriesByTag);
router.get("/:id", getMemoryById);
router.put("/:id", updateMemory);
router.delete("/:id", deleteMemory);
