import { Router } from "express";
import {
  registerUser,
  loginUser
} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { getProfile } from "../services/auth.service";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile",authMiddleware,getProfile);

export default router;