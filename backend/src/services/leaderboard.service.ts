import User from "../models/User";

export const getLeaderboard =
  async () => {

    return User.find()
      .select(
        "username rating"
      )
      .sort({
        rating: -1
      })
      .limit(50);
};