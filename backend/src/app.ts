import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// Future Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/problems", problemRoutes);
// app.use("/api/submissions", submissionRoutes);

export default app;