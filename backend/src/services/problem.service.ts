import Problem from "../models/Problem";

export const createProblem = async (problemData: any) => {
  const existingProblem = await Problem.findOne({
    title: problemData.title,
  });

  if (existingProblem) {
    throw new Error("Problem already exists");
  }

  return await Problem.create(problemData);
};

export const getAllProblems = async () => {
  return await Problem.find().select(
    "title difficulty createdAt"
  );
};

export const getProblemById = async (
  problemId: string
) => {
  const problem = await Problem.findById(problemId);

  if (!problem) {
    throw new Error("Problem not found");
  }

  return problem;
};