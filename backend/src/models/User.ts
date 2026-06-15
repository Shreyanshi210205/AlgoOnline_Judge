import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true
    },
    rating: {
      type: Number,
      default: 0
    },

    solvedProblems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem"
      }
    ]
  },
  {
    timestamps: true
  }
);

export default mongoose.model("User", UserSchema);