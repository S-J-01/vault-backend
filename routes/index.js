import { Router } from "express";
import { router as memoriesRouter } from "./memories.routes.js";

export const router = Router();

router.use("/memories", memoriesRouter);
