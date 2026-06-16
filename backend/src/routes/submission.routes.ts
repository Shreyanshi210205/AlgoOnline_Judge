import { Router } from "express";
import {
  createSubmission,
  getSubmissionById,
  getUserSubmissions
} from "../controllers/submission.controller";

const router = Router();

router.post("/", createSubmission);
router.get("/:id", getSubmissionById);
router.get("/user/:userId", getUserSubmissions);

export default router;