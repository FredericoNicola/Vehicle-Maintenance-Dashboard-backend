import { Request, Response } from "express";
import prisma from "../../utils/prims";
// Ensure this path is correct

export const getVehicles = async (req: Request, res: Response) => {
  const vehicles = await prisma.vehicle.findMany();
  res.json(vehicles);
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
