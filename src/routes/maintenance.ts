import { Router } from "express";
import {
  getMaintenanceForVehicle,
  createMaintenance,
  updateMaintenance,
} from "../controllers/maintenanceController";
import verifyToken from "../middleware/authMiddleware";

const router = Router();
router.use(verifyToken);

// Get all maintenance records for a vehicle
router.get("/vehicle/:vehicleId", getMaintenanceForVehicle);

// Create a new maintenance record
router.post("/", createMaintenance);

// Update a maintenance record
router.put("/:id", updateMaintenance);

export default router;
