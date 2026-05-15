import { Memory } from "../models/memories.models.js";
export const createMemory = async (req, res) => {
  try {
    await Memory.create({
      title: req.body.title,
      type: req.body.type,
      content: req.body.content,
      tags: req.body.tags,
      date: req.body.date,
    });
    res.status(200).json({ message: "memory created successfully" });
  } catch {
    res.status(500).json({ message: "failed to create memory" });
  }
};

export const fetchAllMemories = async (req, res) => {
  try {
    const memoriesList = await Memory.find({});
    res.status(200).json({ AllMemories: memoriesList });
  } catch {
    res.status(500).json({ message: "failed to get memories" });
  }
};

export const getMemoryById = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) {
      return res.status(404).json({ message: "memory not found" });
    }
    res.status(200).json({ memory });
  } catch {
    res.status(500).json({ message: "failed to get memory" });
  }
};

export const findMemoriesByTag = async (req, res) => {
  try {
    const memoriesByTag = await Memory.find({ tags: req.body.tag });
    res.status(200).json({ memoriesByTag: memoriesByTag });
  } catch {
    res.status(500).json({ message: "server error" });
  }
};

export const updateMemory = async (req, res) => {
  try {
    const memory = await Memory.findById(req.params.id);
    memory.title = req.body.title;
    await memory.save();
    res.status(200).json({ message: "memory title updated" });
  } catch {
    res.status(500).json({ message: "memory title could not be updated" });
  }
};

export const deleteMemory = async (req, res) => {
  try {
    const deletedMemory = await Memory.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "memory deleted",
      deletedMemory,
    });
  } catch {
    res.status(500).json({ message: "memory could not be deleted" });
  }
};
