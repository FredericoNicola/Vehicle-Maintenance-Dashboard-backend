import { Request, Response } from "express";
import prisma from "../../utils/prims";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "secretkey";

export const registerUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await prisma.user.create({
    data: { email, password: hashedPassword },
  });

  res.status(201).json({ id: newUser.id, email: newUser.email });
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(404).json({ message: "User not found" });

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: "7d" });
  res.json({ token });
};
