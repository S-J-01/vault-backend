import mongoose from "mongoose";

const memoriesSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["link", "note"],
    default: "note",
  },
  content: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export const Memory = mongoose.model("Memory", memoriesSchema);
