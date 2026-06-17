import { Router } from "express";
import {
  createSubmission,
  getSubmissionById,
  getUserSubmissions,
  runSubmission
} from "../controllers/submission.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", createSubmission,authMiddleware);
router.get("/:id", getSubmissionById);
router.get("/user/:userId", getUserSubmissions);
router.post(
  "/run",
  runSubmission
);

export default router;