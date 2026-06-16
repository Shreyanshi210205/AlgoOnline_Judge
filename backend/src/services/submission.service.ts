import Submission from "../models/Submission";
import { addSubmissionJob } from "../jobs/submission.job";

export const createSubmission = async (
  submissionData: any
) => {

  const submission =
    await Submission.create({
      ...submissionData,
      verdict: "Pending"
    });

  await addSubmissionJob(
    submission._id.toString()
  );

  return submission;
};
export const getSubmissionById = async (
  submissionId: string
) => {
  const submission = await Submission.findById(
    submissionId
  )
    .populate("userId", "username")
    .populate("problemId", "title difficulty");

  if (!submission) {
    throw new Error("Submission not found");
  }

  return submission;
};

export const getUserSubmissions = async (
  userId: string
) => {
  return await Submission.find({
    userId,
  })
    .populate("problemId", "title difficulty")
    .sort({
      createdAt: -1,
    });
};

export const updateSubmissionVerdict = async (
  submissionId: string,
  verdict: string,
  executionTime: number,
  memoryUsed: number
) => {
  return await Submission.findByIdAndUpdate(
    submissionId,
    {
      verdict,
      executionTime,
      memoryUsed,
    },
    {
      new: true,
    }
  );
};