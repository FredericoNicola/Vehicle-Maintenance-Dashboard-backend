import { Status } from "@prisma/client";
import { Request, Response } from "express";
import prisma from "../../utils/prisma";

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).userId;

    // Use select to only fetch needed fields
    const vehicles = await prisma.vehicle.findMany({
      where: { userId },
      select: {
        id: true,
        vin: true,
        licensePlate: true,
        make: true,
        model: true,
        year: true,
        status: true,
        km: true,
        zoneOp: true,
      },
      orderBy: { id: "asc" },
    });

    res.json(vehicles);
  } catch (error) {
    console.error("getVehicles error:", error);
    res.status(500).json({
      message: "Failed to fetch vehicles",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const createVehicle = async (req: Request, res: Response) => {
  try {
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
      select: {
        id: true,
        vin: true,
        licensePlate: true,
        make: true,
        model: true,
        year: true,
        status: true,
      },
    });

    res.status(201).json(newVehicle);
  } catch (error) {
    console.error("createVehicle error:", error);
    res.status(500).json({
      message: "Failed to create vehicle",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { vin, licensePlate, make, model, year } = req.body;
    const userId = (req.user as any).userId;

    // Single query to update and verify ownership
    const updatedVehicle = await prisma.vehicle.updateMany({
      where: {
        id: Number(id),
        userId, // This ensures the vehicle belongs to the user
      },
      data: {
        vin,
        licensePlate,
        make,
        model,
        year,
      },
    });

    if (updatedVehicle.count === 0) {
      return res
        .status(404)
        .json({ message: "Vehicle not found or access denied" });
    }

    // Fetch the updated vehicle
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        vin: true,
        licensePlate: true,
        make: true,
        model: true,
        year: true,
        status: true,
      },
    });

    res.json(vehicle);
  } catch (error) {
    console.error("updateVehicle error:", error);
    res.status(500).json({
      message: "Failed to update vehicle",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateVehicleStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = (req.user as any).userId;

    // Single query to update status and verify ownership
    const updatedVehicle = await prisma.vehicle.updateMany({
      where: {
        id: Number(id),
        userId,
      },
      data: { status: status as Status },
    });

    if (updatedVehicle.count === 0) {
      return res
        .status(404)
        .json({ message: "Vehicle not found or access denied" });
    }

    res.json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("updateVehicleStatus error:", error);
    res.status(500).json({
      message: "Failed to update vehicle status",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getVehicleStatuses = (req: Request, res: Response) => {
  res.json(Object.values(Status));
};

export const getBrokenDownVehicles = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).userId;
    const vehicles = await prisma.vehicle.findMany({
      where: {
        userId,
        status: "BROKEN_DOWN",
      },
      select: {
        id: true,
        vin: true,
        licensePlate: true,
        make: true,
        model: true,
        year: true,
        status: true,
        km: true,
        zoneOp: true,
      },
      orderBy: { id: "asc" },
    });
    res.json(vehicles);
  } catch (error) {
    console.error("getBrokenDownVehicles error:", error);
    res.status(500).json({
      message: "Failed to fetch broken down vehicles",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req.user as any).userId;

    const vehicle = await prisma.vehicle.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        vin: true,
        licensePlate: true,
        make: true,
        model: true,
        year: true,
        status: true,
        userId: true,
      },
    });

    if (!vehicle || vehicle.userId !== userId) {
      return res
        .status(404)
        .json({ message: "Vehicle not found or access denied" });
    }

    res.json(vehicle);
  } catch (error) {
    console.error("getVehicle error:", error);
    res.status(500).json({
      message: "Failed to fetch vehicle",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
