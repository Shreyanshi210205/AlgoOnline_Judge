import { Router } from "express";
import {
  createSubmission,
  getSubmissionById,
  getUserSubmissions,
  getProblemSubmissions,
  runSubmission
} from "../controllers/submission.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", createSubmission,authMiddleware);
router.get("/:id", getSubmissionById);
router.get("/user/:userId", getUserSubmissions);
router.get("/problem/:problemId", getProblemSubmissions);
router.post(
  "/run",
  runSubmission
);

export default router;