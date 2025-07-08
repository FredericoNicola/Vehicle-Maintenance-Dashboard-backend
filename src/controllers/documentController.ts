import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const uploadDocument = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  const userId = (req.user as any).userId;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Ensure the vehicle belongs to the logged-in user
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: Number(vehicleId) },
  });
  if (!vehicle || vehicle.userId !== userId) {
    return res.status(404).json({ message: "Vehicle not found" });
  }

  try {
    const doc = await prisma.document.create({
      data: {
        filename: req.file.originalname,
        url: `/uploads/${req.file.filename}`,
        vehicleId: Number(vehicleId),
      },
    });
    res.status(201).json(doc);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to upload document",
      error: error instanceof Error ? error.message : error,
    });
  }
};

export const getDocumentsForVehicle = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  const userId = (req.user as any).userId;

  // Ensure the vehicle belongs to the user
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: Number(vehicleId) },
  });
  if (!vehicle || vehicle.userId !== userId) {
    return res.status(404).json({ message: "Vehicle not found" });
  }

  const docs = await prisma.document.findMany({
    where: { vehicleId: Number(vehicleId) },
    orderBy: { uploadedAt: "desc" },
  });
  res.json(docs);
};
