import { Queue } from "bullmq";
import { redisConfig } from "../config/redis";

const submissionQueue = new Queue(
  "submission-queue",
  {
    connection: redisConfig,
  }
);

export const addSubmissionJob = async (
  submissionId: string
) => {
  await submissionQueue.add(
    "evaluate-submission",
    {
      submissionId,
    }
  );
};