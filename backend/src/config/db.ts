import mongoose from "mongoose";
import dotenv from "dotenv"



export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      process.env.MONGO_URI as string
    );

    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error("MongoDB Connection Error:", error);

    process.exit(1);
  }
};