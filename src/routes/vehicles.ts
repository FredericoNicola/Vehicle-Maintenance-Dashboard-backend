import express from "express";
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  getVehicleStatuses,
  updateVehicleStatus,
  getBrokenDownVehicles,
  getVehicle,
} from "../controllers/vehicleController";
import verifyToken from "../middleware/authMiddleware";
const router = express.Router();

router.use(verifyToken);

router.get("/", getVehicles);
router.post("/", createVehicle);
router.put("/:id", (req, res, next) => {
  Promise.resolve(updateVehicle(req, res)).catch(next);
});
router.get("/statuses", getVehicleStatuses);
router.patch("/:id/status", (req, res, next) => {
  Promise.resolve(updateVehicleStatus(req, res)).catch(next);
});
router.get("/broken-down", getBrokenDownVehicles);
router.get("/:id", (req, res, next) => {
  Promise.resolve(getVehicle(req, res)).catch(next);
});

export default router;
