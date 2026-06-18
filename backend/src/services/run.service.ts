import Problem from "../models/Problem";
import { executeCpp } from "../executors/cpp.executor";
import { executePython } from "../executors/python.executor";
import { executeJava } from "../executors/java.executor";
import { executeJavascript } from "../executors/js.executor";

export const runCode = async (
  problemId: string,
  code: string,
  language: string
) => {
  const problem = await Problem.findById(problemId);

  if (!problem) {
    throw new Error("Problem not found");
  }

  const results = [];

  for (const testCase of problem.visibleTestCases) {
    let result;

    switch (language.toLowerCase()) {
      case "cpp":
        result = await executeCpp(
          code,
          testCase.input,
          "run"
        );
        break;

      case "python":
        result = await executePython(
          code,
          testCase.input,
          "run"
        );
        break;

      case "java":
        result = await executeJava(
          code,
          testCase.input,
          "run"
        );
        break;

      case "javascript":
        result = await executeJavascript(
          code,
          testCase.input,
          "run"
        );
        break;

      default:
        throw new Error(
          `Language ${language} not supported`
        );
    }

    results.push({
      input: testCase.input,
      expectedOutput: testCase.output,
      actualOutput: result?.output ?? "",
      passed:
        (result?.output ?? "").trim() ===
        testCase.output.trim(),
    });
  }

  return results;
};