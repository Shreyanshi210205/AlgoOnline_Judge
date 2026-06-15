import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },

    language: {
      type: String,
      enum: ["cpp", "java", "python", "javascript"],
      required: true,
    },

    code: {
      type: String,
      required: true,
    },

    verdict: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Wrong Answer",
        "Compilation Error",
        "Runtime Error",
        "Time Limit Exceeded",
        "Memory Limit Exceeded",
      ],
      default: "Pending",
    },

    testCasesPassed: {
      type: Number,
      default: 0,
    },

    executionTime: {
      type: Number,
      default: 0,
    },

    memoryUsed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Submission", SubmissionSchema);
