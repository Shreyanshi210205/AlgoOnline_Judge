import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import problemRoutes from "./routes/problem.routes";
import submissionRoutes from "./routes/submission.routes";
import { errorMiddleware } from "./middleware/error.middleware";
import { notFoundMiddleware } from "./middleware/notFound.middleware";
import testRoutes from "./routes/test.route";

dotenv.config();

const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/problems", problemRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/test", testRoutes);

app.use(errorMiddleware)
app.use(notFoundMiddleware)


export default app;