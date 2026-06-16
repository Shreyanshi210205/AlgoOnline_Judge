import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export const registerUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { username, email, password } = req.body;

    const user = await authService.register(
      username,
      email,
      password
    );

    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (
  req: Request,
  res: Response
) => {
  try {
    const { username, password } = req.body;

    const result = await authService.login(
      username,
      password
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};