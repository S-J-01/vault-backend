import { Memory } from "../models/memories.models.js";
export const createMemory = (req, res) => {};

export const fetchAllMemories = async (req, res) => {
  try {
    const memoriesList = await Memory.find({});
    res.status(200).json({ AllMemories: memoriesList });
  } catch {
    res.status(500).json({ message: "failed to get memories" });
  }
};

export const findMemoriesByTag = (req, res) => {};

export const updateMemory = (req, res) => {};

export const deleteMemory = (req, res) => {};
