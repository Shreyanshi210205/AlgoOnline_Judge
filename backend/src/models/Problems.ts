import mongoose from "mongoose";

const TestCaseSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      required: true
    },

    output: {
      type: String,
      required: true
    }
  },
  {
    _id: false
  }
);

const ProblemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true
    },

    statement: {
      type: String,
      required: true
    },

    inputFormat: {
      type: String,
      required: true
    },

    outputFormat: {
      type: String,
      required: true
    },

    constraints: {
      type: String,
      required: true
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true
    },
    visibleTestCases: [TestCaseSchema],

    hiddenTestCases: [TestCaseSchema],

    timeLimit: {
      type: Number,
      default: 2
    },

    memoryLimit: {
      type: Number,
      default: 256
    },
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Problem", ProblemSchema);