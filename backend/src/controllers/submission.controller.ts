import { Request, Response } from "express";
import * as submissionService from "../services/submission.service";

export const createSubmission = async (
  req: Request,
  res: Response
) => {
  try {
    const submission =
      await submissionService.createSubmission(
        req.body
      );

    res.status(201).json({
      success: true,
      data: submission,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSubmissionById = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing id parameter",
      });
    }

    const submission = await submissionService.getSubmissionById(id);

    res.status(200).json({
      success: true,
      data: submission,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserSubmissions = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.params;

    if (!userId || Array.isArray(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing userId parameter",
      });
    }

    const submissions = await submissionService.getUserSubmissions(userId);

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};