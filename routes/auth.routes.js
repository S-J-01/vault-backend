import { Router } from "express";
import { login, logout, me } from "../controllers/auth.controllers.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { loginRateLimit } from "../middleware/loginRateLimit.js";

export const router = Router();

router.post("/login", loginRateLimit, asyncHandler(login));
router.post("/logout", asyncHandler(logout));
router.get("/me", asyncHandler(me));
