import express from "express";
import { getVehicles, createVehicle } from "../controllers/vehicleController";
import verifyToken from "../middleware/authMiddleware";
const router = express.Router();

router.get("/", verifyToken, getVehicles);
router.post("/", verifyToken, createVehicle);

export default router;
