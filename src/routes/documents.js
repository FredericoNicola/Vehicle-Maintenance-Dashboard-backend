"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const documentController_1 = require("../controllers/documentController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
const storage = multer_1.default.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        const basename = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, basename + ext);
    },
});
const upload = (0, multer_1.default)({ storage });
router.get("/vehicle/:vehicleId", authMiddleware_1.default, (req, res, next) => {
    Promise.resolve((0, documentController_1.getDocumentsForVehicle)(req, res)).catch(next);
});
router.post("/:vehicleId", authMiddleware_1.default, upload.single("file"), (req, res, next) => {
    (0, documentController_1.uploadDocument)(req, res).catch(next);
});
exports.default = router;
