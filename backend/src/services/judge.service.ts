import Submission from "../models/Submission";
import Problem from "../models/Problem";
import { executeCpp } from "../executors/cpp.executor";
import mongoose from "mongoose";

export const judgeSubmission = async (
  submissionId: string
) => {

    console.log("1. Finding submission");

console.log(
  "Mongo State:",
  mongoose.connection.readyState
);
  const submission =
    await Submission.findById(submissionId);
    console.log("1. sub found");


  if (!submission) {
    throw new Error("Submission not found");
  }

  const problem =
    await Problem.findById(
      submission.problemId
    );

    console.log("3. Problem found");


  if (!problem) {
    throw new Error("Problem not found");
  }

  const testCases = [
    ...problem.hiddenTestCases,
  ];

  try {

    for (const testCase of testCases) {
  console.log("4. Running testcase");
      let result;

      switch (submission.language) {

        case "cpp":
          result = await executeCpp(
            submission.code,
            testCase.input
          );
            console.log("5. Result:", result);

          break;

        default:
          throw new Error(
            "Language not supported"
          );
      }

      

      if (!result.success) {

        submission.verdict =
          "Compilation Error";

        await submission.save();

        return;
      }

      const actualOutput =
        (result.output ?? "").trim();

      const expectedOutput =
        testCase.output.trim();

      if (
        actualOutput !== expectedOutput
      ) {

        submission.verdict =
          "Wrong Answer";

        await submission.save();

        return;
      }
    }

    submission.verdict =
      "Accepted";

    await submission.save();

  } catch (error) {

    submission.verdict =
      "Runtime Error";

    await submission.save();

    throw error;
  }
};