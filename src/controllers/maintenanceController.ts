import { Request, Response } from "express";
import prisma from "../../utils/prisma";

// Get all maintenance records for a vehicle
export const getMaintenanceForVehicle = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  const records = await prisma.maintenanceRecord.findMany({
    where: { vehicleId: Number(vehicleId) },
    include: {
      partner: true,
      invoiceDocument: true, // <-- include the invoice document
    },
    orderBy: { datePerformed: "desc" },
  });
  res.json(records);
};

// Create a new maintenance record
export const createMaintenance = async (req: Request, res: Response) => {
  const data = req.body;
  const record = await prisma.maintenanceRecord.create({ data });
  res.status(201).json(record);
};

// Update a maintenance record
export const updateMaintenance = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;
  const record = await prisma.maintenanceRecord.update({
    where: { id: Number(id) },
    data,
  });
  res.json(record);
};
