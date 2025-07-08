import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).userId;
    const vehicles = await prisma.vehicle.findMany({ where: { userId } });
    res.json(vehicles);
  } catch (error) {
    console.error(error); // This will print the error in your backend console
    res
      .status(500)
      .json({
        message: "Failed to fetch vehicles",
        error: error instanceof Error ? error.message : error,
      });
  }
};

export const createVehicle = async (req: Request, res: Response) => {
  const { vin, licensePlate, make, model, year } = req.body;
  const userId = (req.user as any).userId;
  const newVehicle = await prisma.vehicle.create({
    data: {
      vin,
      licensePlate,
      make,
      model,
      year,
      userId,
    },
  });
  res.status(201).json(newVehicle);
};

export const updateVehicle = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { vin, licensePlate, make, model, year } = req.body;
  const userId = (req.user as any).userId;

  try {
    // Ensure the vehicle belongs to the user
    const existing = await prisma.vehicle.findUnique({ where: { id: Number(id) } });
    if (!existing || existing.userId !== userId) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const updated = await prisma.vehicle.update({
      where: { id: Number(id) },
      data: { vin, licensePlate, make, model, year },
    });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update vehicle",
      error: error instanceof Error ? error.message : error,
    });
  }
};
