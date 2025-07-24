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
exports.getDocumentsForVehicle = exports.uploadDocument = void 0;
const prisma_1 = __importDefault(require("../../utils/prisma"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const pdfTransform_1 = require("../../utils/pdfTransform");
const qrDecoder_1 = require("../../utils/qrDecoder");
/**
 * Parses a QR code string into a key-value object.
 */
function parseQRCodeString(qrString) {
    return qrString.split("*").reduce((acc, pair) => {
        const [key, ...rest] = pair.split(":");
        if (key && rest.length)
            acc[key] = rest.join(":");
        return acc;
    }, {});
}
/**
 * Handles document upload, extracts QR code, and saves metadata.
 */
const uploadDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vehicleId } = req.params;
    const userId = req.user.userId;
    const { type, expireDate } = req.body; // <-- Get from form-data
    if (!req.file)
        return res.status(400).json({ message: "No file uploaded" });
    // Ensure the vehicle belongs to the logged-in user
    const vehicle = yield prisma_1.default.vehicle.findUnique({
        where: { id: Number(vehicleId) },
    });
    if (!vehicle || vehicle.userId !== userId)
        return res.status(404).json({ message: "Vehicle not found" });
    // Block duplicate periodic inspection for this vehicle
    if (type === "PERIODIC_INSPECTION") {
        const existing = yield prisma_1.default.document.findFirst({
            where: {
                vehicleId: Number(vehicleId),
                type: "PERIODIC_INSPECTION",
            },
        });
        if (existing) {
            return res.status(409).json({
                message: "This vehicle already has a Periodic Inspection document. Please delete the old one before adding a new one.",
                existingDocId: existing.id,
            });
        }
    }
    let qrCodeString = "";
    let qrCodeData = null;
    try {
        const ext = path_1.default.extname(req.file.originalname).toLowerCase();
        if (ext === ".pdf") {
            const outputDir = path_1.default.join(__dirname, "../../uploads", `pdf_${Date.now()}`);
            const imagePaths = yield (0, pdfTransform_1.convertPdfToImages)(fs_1.default.readFileSync(req.file.path), outputDir);
            for (const imgPath of imagePaths) {
                const qr = yield (0, qrDecoder_1.decodeQR)(imgPath);
                // Delete the image after decoding attempt
                try {
                    fs_1.default.unlinkSync(imgPath);
                }
                catch (err) {
                    console.error(`Failed to delete image ${imgPath}:`, err);
                }
                if (qr) {
                    qrCodeString = qr;
                    break;
                }
            }
            // Delete temp.pdf if it exists
            const tempPdfPath = path_1.default.join(outputDir, "temp.pdf");
            if (fs_1.default.existsSync(tempPdfPath)) {
                try {
                    fs_1.default.unlinkSync(tempPdfPath);
                }
                catch (err) {
                    console.error(`Failed to delete temp.pdf:`, err);
                }
            }
            // Remove all files in the outputDir, then remove the directory
            try {
                if (fs_1.default.existsSync(outputDir)) {
                    fs_1.default.rmSync(outputDir, { recursive: true, force: true });
                }
            }
            catch (err) {
                console.error(`Failed to fully remove directory ${outputDir}:`, err);
            }
        }
        else if ([".jpg", ".jpeg", ".png"].includes(ext)) {
            qrCodeString = yield (0, qrDecoder_1.decodeQR)(req.file.path);
        }
        if (qrCodeString)
            qrCodeData = parseQRCodeString(qrCodeString);
        const doc = yield prisma_1.default.document.create({
            data: Object.assign(Object.assign({ filename: req.file.originalname, url: `/uploads/${req.file.filename}`, vehicleId: Number(vehicleId), qrCode: qrCodeString || null }, (qrCodeData ? { qrCodeData } : {})), { type, expireDate: expireDate ? new Date(expireDate) : null }),
        });
        res.status(201).json(doc);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to upload document",
            error: error instanceof Error ? error.message : error,
        });
    }
});
exports.uploadDocument = uploadDocument;
/**
 * Returns all documents for a vehicle, including file format.
 */
const getDocumentsForVehicle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { vehicleId } = req.params;
    const userId = req.user.userId;
    // Ensure the vehicle belongs to the user
    const vehicle = yield prisma_1.default.vehicle.findUnique({
        where: { id: Number(vehicleId) },
    });
    if (!vehicle || vehicle.userId !== userId)
        return res.status(404).json({ message: "Vehicle not found" });
    const docs = yield prisma_1.default.document.findMany({
        where: { vehicleId: Number(vehicleId) },
        orderBy: { uploadedAt: "desc" },
    });
    const docsWithFormat = docs.map((doc) => (Object.assign(Object.assign({}, doc), { fileFormat: doc.filename.split(".").pop() || null })));
    res.json(docsWithFormat);
});
exports.getDocumentsForVehicle = getDocumentsForVehicle;
