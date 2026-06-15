import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const register = async (
  username: string,
  email: string,
  password: string
) => {
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword
  });

  return user;
};

export const login = async (
  username: string,
  password: string
) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      id: user._id
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "15d"
    }
  );

  return {
    token,
    user
  };
};