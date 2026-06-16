import { Router } from "express";
import {
  createSubmission,
  getSubmissionById,
  getUserSubmissions
} from "../controllers/submission.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", createSubmission,authMiddleware);
router.get("/:id", getSubmissionById);
router.get("/submissions/:userId", getUserSubmissions);

export default router;