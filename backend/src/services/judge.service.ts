import Submission from "../models/Submission";
import Problem from "../models/Problem";
import { executeCpp } from "../executors/cpp.executor";
import { executePython } from "../executors/python.executor";
import { executeJava } from "../executors/java.executor";
import { executeJavascript } from "../executors/js.executor";
import mongoose from "mongoose";
import User from "../models/User";

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
      let passedCount = 0;
let maxExecutionTime = 0;
    for (const testCase of testCases) {
  console.log("4. Running testcase");
      let result;

      switch (submission.language) {

  case "cpp":
    result = await executeCpp(
      submission.code,
      testCase.input,
      submission._id.toString()
    );
    break;

  case "python":
    result = await executePython(
      submission.code,
      testCase.input,
      submission._id.toString()
    );
    break;

  case "java":
    result = await executeJava(
      submission.code,
      testCase.input,
      submission._id.toString()
    );
    break;

  case "javascript":
    result = await executeJavascript(
      submission.code,
      testCase.input,
      submission._id.toString()
    );
    break;

  default:
    throw new Error(
      "Language not supported"
    );
}
      if (result.executionTime) {
  maxExecutionTime = Math.max(
    maxExecutionTime,
    result.executionTime
  );
}

      if (!result.success) {
submission.testCasesPassed =
    passedCount;

  submission.executionTime =
    maxExecutionTime;
  switch(result.type) {

    case "Compilation Error":
      submission.verdict =
        "Compilation Error";
      break;

    case "Runtime Error":
      submission.verdict =
        "Runtime Error";
      break;

    case "Time Limit Exceeded":
      submission.verdict =
        "Time Limit Exceeded";
      break;

    default:
      submission.verdict =
        "Runtime Error";
  }

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
          submission.testCasesPassed =
  passedCount;

submission.executionTime =
  maxExecutionTime;
        submission.verdict =
          "Wrong Answer";

        await submission.save();

        return;
      }
      passedCount++;
    }

submission.verdict = "Accepted";

submission.testCasesPassed =
  passedCount;

submission.executionTime =
  maxExecutionTime;

const user = await User.findById(
  submission.userId
);

if (user) {

  const alreadySolved =
    user.solvedProblems.some(
      (id) =>
        id.toString() ===
        submission.problemId.toString()
    );

  if (!alreadySolved) {

    switch (problem.difficulty) {

      case "Easy":
        user.rating += 10;
        break;

      case "Medium":
        user.rating += 20;
        break;

      case "Hard":
        user.rating += 30;
        break;
    }

    user.solvedProblems.push(
      submission.problemId
    );

    await user.save();
  }
}

await submission.save();

  } catch (error) {

    submission.verdict =
      "Runtime Error";

    await submission.save();

    throw error;
  }
};