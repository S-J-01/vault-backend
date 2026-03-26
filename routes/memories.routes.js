import { Router } from "express";
export const router = Router();

router.post("/", createMemory);
router.get("/", fetchAllMemories);
router.get("/search", findMemoriesByTag);
router.put("/:id", updateMemory);
router.delete("/:id", deleteMemory);
