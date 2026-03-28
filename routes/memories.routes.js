import { Router } from "express";
import {
  createMemory,
  fetchAllMemories,
  findMemoriesByTag,
  updateMemory,
  deleteMemory,
} from "../controllers/memories.controllers.js";
export const router = Router();

router.post("/", createMemory);
router.get("/", fetchAllMemories);
router.get("/search", findMemoriesByTag);
router.put("/:id", updateMemory);
router.delete("/:id", deleteMemory);
