"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVehicle = exports.getBrokenDownVehicles = exports.getVehicleStatuses = exports.updateVehicleStatus = exports.updateVehicle = exports.createVehicle = exports.getVehicles = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../utils/prisma"));
const getVehicles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        // Use select to only fetch needed fields
        const vehicles = yield prisma_1.default.vehicle.findMany({
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
    }
    catch (error) {
        console.error("getVehicles error:", error);
        res.status(500).json({
            message: "Failed to fetch vehicles",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getVehicles = getVehicles;
const createVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { vin, licensePlate, make, model, year } = req.body;
        const userId = req.user.userId;
        const newVehicle = yield prisma_1.default.vehicle.create({
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
    }
    catch (error) {
        console.error("createVehicle error:", error);
        res.status(500).json({
            message: "Failed to create vehicle",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.createVehicle = createVehicle;
const updateVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { vin, licensePlate, make, model, year } = req.body;
        const userId = req.user.userId;
        // Single query to update and verify ownership
        const updatedVehicle = yield prisma_1.default.vehicle.updateMany({
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
        const vehicle = yield prisma_1.default.vehicle.findUnique({
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
    }
    catch (error) {
        console.error("updateVehicle error:", error);
        res.status(500).json({
            message: "Failed to update vehicle",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.updateVehicle = updateVehicle;
const updateVehicleStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user.userId;
        // Single query to update status and verify ownership
        const updatedVehicle = yield prisma_1.default.vehicle.updateMany({
            where: {
                id: Number(id),
                userId,
            },
            data: { status: status },
        });
        if (updatedVehicle.count === 0) {
            return res
                .status(404)
                .json({ message: "Vehicle not found or access denied" });
        }
        res.json({ message: "Status updated successfully" });
    }
    catch (error) {
        console.error("updateVehicleStatus error:", error);
        res.status(500).json({
            message: "Failed to update vehicle status",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.updateVehicleStatus = updateVehicleStatus;
const getVehicleStatuses = (req, res) => {
    res.json(Object.values(client_1.Status));
};
exports.getVehicleStatuses = getVehicleStatuses;
const getBrokenDownVehicles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.userId;
        const vehicles = yield prisma_1.default.vehicle.findMany({
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
    }
    catch (error) {
        console.error("getBrokenDownVehicles error:", error);
        res.status(500).json({
            message: "Failed to fetch broken down vehicles",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getBrokenDownVehicles = getBrokenDownVehicles;
const getVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userId = req.user.userId;
        const vehicle = yield prisma_1.default.vehicle.findUnique({
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
    }
    catch (error) {
        console.error("getVehicle error:", error);
        res.status(500).json({
            message: "Failed to fetch vehicle",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
exports.getVehicle = getVehicle;
