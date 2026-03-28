import express from "express";

import { router as apiRouter } from "./routes/index.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
const app = express();
app.use(express.json());

app.use("/api/v1", apiRouter);
const start = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("mongoose connected to mongodb");
  app.listen(3000, () => {
    console.log("server started on port 3000");
  });
};

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
