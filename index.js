import express from "express";
import cookieParser from "cookie-parser";

import { router as apiRouter } from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET || "dev-secret"));

app.get("/health", (req, res) => {
  res.status(200).json({ ok: true });
});

app.use("/api/v1", apiRouter);

app.use((req, res) => {
  res.status(404).json({ message: "not found" });
});

app.use(errorHandler);

const port = Number(process.env.PORT) || 3000;

const start = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("mongoose connected to mongodb");
  app.listen(port, () => {
    console.log(`server started on port ${port}`);
  });
};

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
