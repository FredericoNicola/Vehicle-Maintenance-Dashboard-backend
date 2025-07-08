import express from "express";
import {
  getVehicles,
  createVehicle,
  updateVehicle,
} from "../controllers/vehicleController";
import verifyToken from "../middleware/authMiddleware";
const router = express.Router();

router.get("/", verifyToken, getVehicles);
router.post("/", verifyToken, createVehicle);
router.put("/:id", verifyToken, (req, res, next) => {
  Promise.resolve(updateVehicle(req, res)).catch(next);
});

export default router;
