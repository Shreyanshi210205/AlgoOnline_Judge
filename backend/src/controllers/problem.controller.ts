import { Request, Response } from "express";
import * as problemService from "../services/problem.service";

export const createProblem = async (
  req: Request,
  res: Response
) => {
  try {
    const problem = await problemService.createProblem(
      req.body
    );

    res.status(201).json({
      success: true,
      data: problem,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllProblems = async (
  req: Request,
  res: Response
) => {
  try {
    const problems =
      await problemService.getAllProblems();

    res.status(200).json({
      success: true,
      count: problems.length,
      data: problems,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProblemById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    const problem =
      await problemService.getProblemById(id);

    res.status(200).json({
      success: true,
      data: problem,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};