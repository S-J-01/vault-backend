import { Memory } from "../models/memories.models.js";
import { HttpError } from "../middleware/errorHandler.js";

export const createMemory = async (req, res) => {
  await Memory.create({
    ownerId: req.user.id,
    title: req.body.title,
    type: req.body.type,
    content: req.body.content,
    tags: req.body.tags,
    date: req.body.date,
  });
  res.status(200).json({ message: "memory created successfully" });
};

export const fetchAllMemories = async (req, res) => {
  const memoriesList = await Memory.find({ ownerId: req.user.id });
  res.status(200).json({ AllMemories: memoriesList });
};

export const getMemoryById = async (req, res) => {
  const memory = await Memory.findOne({
    _id: req.params.id,
    ownerId: req.user.id,
  });
  if (!memory) {
    throw new HttpError(404, "memory not found");
  }
  res.status(200).json({ memory });
};

export const fetchAllTags = async (req, res) => {
  const tags = await Memory.distinct("tags", { ownerId: req.user.id });
  res.status(200).json({ tags });
};

export const findMemoriesByTag = async (req, res) => {
  const memoriesByTag = await Memory.find({
    tags: req.body.tag,
    ownerId: req.user.id,
  });
  res.status(200).json({ memoriesByTag });
};

export const updateMemory = async (req, res) => {
  const memory = await Memory.findOne({
    _id: req.params.id,
    ownerId: req.user.id,
  });
  if (!memory) {
    throw new HttpError(404, "memory not found");
  }
  memory.title = req.body.title;
  await memory.save();
  res.status(200).json({ message: "memory title updated" });
};

export const deleteMemory = async (req, res) => {
  const deletedMemory = await Memory.findOneAndDelete({
    _id: req.params.id,
    ownerId: req.user.id,
  });
  if (!deletedMemory) {
    throw new HttpError(404, "memory not found");
  }
  res.status(200).json({
    message: "memory deleted",
    deletedMemory,
  });
};
