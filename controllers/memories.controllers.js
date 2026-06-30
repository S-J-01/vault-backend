import { Memory } from "../models/memories.models.js";
import { HttpError } from "../middleware/errorHandler.js";

export const createMemory = async (req, res) => {
  await Memory.create({
    title: req.body.title,
    type: req.body.type,
    content: req.body.content,
    tags: req.body.tags,
    date: req.body.date,
  });
  res.status(200).json({ message: "memory created successfully" });
};

export const fetchAllMemories = async (req, res) => {
  const memoriesList = await Memory.find({});
  res.status(200).json({ AllMemories: memoriesList });
};

export const getMemoryById = async (req, res) => {
  const memory = await Memory.findById(req.params.id);
  if (!memory) {
    throw new HttpError(404, "memory not found");
  }
  res.status(200).json({ memory });
};

export const fetchAllTags = async (req, res) => {
  const tags = await Memory.distinct("tags");
  res.status(200).json({ tags });
};

export const findMemoriesByTag = async (req, res) => {
  const memoriesByTag = await Memory.find({ tags: req.body.tag });
  res.status(200).json({ memoriesByTag });
};

export const updateMemory = async (req, res) => {
  const memory = await Memory.findById(req.params.id);
  if (!memory) {
    throw new HttpError(404, "memory not found");
  }
  memory.title = req.body.title;
  await memory.save();
  res.status(200).json({ message: "memory title updated" });
};

export const deleteMemory = async (req, res) => {
  const deletedMemory = await Memory.findByIdAndDelete(req.params.id);
  if (!deletedMemory) {
    throw new HttpError(404, "memory not found");
  }
  res.status(200).json({
    message: "memory deleted",
    deletedMemory,
  });
};
