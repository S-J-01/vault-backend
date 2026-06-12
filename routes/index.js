import { Router } from "express";
import { router as memoriesRouter } from "./memories.routes.js";
import { router as authRouter } from "./auth.routes.js";

export const router = Router();

router.use("/auth", authRouter);
router.use("/memories", memoriesRouter);
