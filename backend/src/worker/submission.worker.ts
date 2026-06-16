import { Worker } from "bullmq";
import { redisConfig } from "../config/redis";

const worker = new Worker(
  "submission-queue",
  async (job) => {
    console.log("==========");
    console.log("JOB RECEIVED");
    console.log(job.data);
    console.log("==========");
  },
  {
    connection: redisConfig,
  }
);

console.log("Worker Started");