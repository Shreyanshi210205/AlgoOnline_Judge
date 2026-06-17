import { Router }
from "express";

import {
  leaderboard
}
from "../controllers/leaderboard.controller";

const router = Router();

router.get(
  "/",
  leaderboard
);

export default router;