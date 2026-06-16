import { Worker } from "bullmq";
import { redisConfig } from "../config/redis";

new Worker(
  "submission-queue",
  async (job) => {
    console.log(job.data);
  },
  {
    connection: redisConfig,
  }
);