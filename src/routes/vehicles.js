"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const vehicleController_1 = require("../controllers/vehicleController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
router.use(authMiddleware_1.default);
router.get("/", vehicleController_1.getVehicles);
router.post("/", vehicleController_1.createVehicle);
router.put("/:id", (req, res, next) => {
    Promise.resolve((0, vehicleController_1.updateVehicle)(req, res)).catch(next);
});
router.get("/statuses", vehicleController_1.getVehicleStatuses);
router.patch("/:id/status", (req, res, next) => {
    Promise.resolve((0, vehicleController_1.updateVehicleStatus)(req, res)).catch(next);
});
router.get("/broken-down", vehicleController_1.getBrokenDownVehicles);
router.get("/:id", (req, res, next) => {
    Promise.resolve((0, vehicleController_1.getVehicle)(req, res)).catch(next);
});
exports.default = router;
