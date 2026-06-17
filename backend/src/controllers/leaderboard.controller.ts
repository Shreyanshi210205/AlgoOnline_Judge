import { Request, Response }
from "express";

import {
  getLeaderboard
} from "../services/leaderboard.service";

export const leaderboard =
  async (
    req: Request,
    res: Response
  ) => {

    const users =
      await getLeaderboard();

    return res.status(200).json({
      success: true,
      users
    });
};