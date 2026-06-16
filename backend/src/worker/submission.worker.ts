import { Worker } from "bullmq";
import { redisConfig } from "../config/redis";
import { judgeSubmission } from "../services/judge.service";
import {connectDB} from "../config/db";

const startWorker = async () => {

  await connectDB();

  console.log("Worker Mongo Connected");

const worker = new Worker(
  "submission-queue",
  async (job) => {

    const submissionId =
      job.data.submissionId;

    console.log(
      `Judging ${submissionId}`
    );
    
    await judgeSubmission(
      submissionId
    );

    console.log(
      `Finished ${submissionId}`
    );
  },
  {
    connection: redisConfig,
  }
)};

startWorker()