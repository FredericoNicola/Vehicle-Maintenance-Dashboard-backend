import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import fs from "fs";
import path from "path";
import { convertPdfToImages } from "../../utils/pdfTransform";
import { decodeQR } from "../../utils/qrDecoder";

/**
 * Parses a QR code string into a key-value object.
 */
function parseQRCodeString(qrString: string): Record<string, string> {
  return qrString.split("*").reduce(
    (acc, pair) => {
      const [key, ...rest] = pair.split(":");
      if (key && rest.length) acc[key] = rest.join(":");
      return acc;
    },
    {} as Record<string, string>
  );
}

/**
 * Handles document upload, extracts QR code, and saves metadata.
 */
export const uploadDocument = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  const userId = (req.user as any).userId;
  const { type, expireDate } = req.body; // <-- Get from form-data

  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  // Ensure the vehicle belongs to the logged-in user
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: Number(vehicleId) },
  });
  if (!vehicle || vehicle.userId !== userId)
    return res.status(404).json({ message: "Vehicle not found" });

  // Block duplicate periodic inspection for this vehicle
  if (type === "PERIODIC_INSPECTION") {
    const existing = await prisma.document.findFirst({
      where: {
        vehicleId: Number(vehicleId),
        type: "PERIODIC_INSPECTION",
      },
    });
    if (existing) {
      return res.status(409).json({
        message:
          "This vehicle already has a Periodic Inspection document. Please delete the old one before adding a new one.",
        existingDocId: existing.id,
      });
    }
  }

  let qrCodeString = "";
  let qrCodeData: Record<string, string> | null = null;

  try {
    const ext = path.extname(req.file.originalname).toLowerCase();

    if (ext === ".pdf") {
      const outputDir = path.join(
        __dirname,
        "../../uploads",
        `pdf_${Date.now()}`
      );
      const imagePaths = await convertPdfToImages(
        fs.readFileSync(req.file.path),
        outputDir
      );
      for (const imgPath of imagePaths) {
        const qr = await decodeQR(imgPath);
        // Delete the image after decoding attempt
        try {
          fs.unlinkSync(imgPath);
        } catch (err) {
          console.error(`Failed to delete image ${imgPath}:`, err);
        }
        if (qr) {
          qrCodeString = qr;
          break;
        }
      }
      // Delete temp.pdf if it exists
      const tempPdfPath = path.join(outputDir, "temp.pdf");
      if (fs.existsSync(tempPdfPath)) {
        try {
          fs.unlinkSync(tempPdfPath);
        } catch (err) {
          console.error(`Failed to delete temp.pdf:`, err);
        }
      }
      // Remove all files in the outputDir, then remove the directory
      try {
        if (fs.existsSync(outputDir)) {
          fs.rmSync(outputDir, { recursive: true, force: true });
        }
      } catch (err) {
        console.error(`Failed to fully remove directory ${outputDir}:`, err);
      }
    } else if ([".jpg", ".jpeg", ".png"].includes(ext)) {
      qrCodeString = await decodeQR(req.file.path);
    }

    if (qrCodeString) qrCodeData = parseQRCodeString(qrCodeString);

    const doc = await prisma.document.create({
      data: {
        filename: req.file.originalname,
        url: `/uploads/${req.file.filename}`,
        vehicleId: Number(vehicleId),
        qrCode: qrCodeString || null,
        ...(qrCodeData ? { qrCodeData } : {}),
        type, // <-- Save type
        expireDate: expireDate ? new Date(expireDate) : null, // <-- Save expireDate
      },
    });
    res.status(201).json(doc);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to upload document",
      error: error instanceof Error ? error.message : error,
    });
  }
};

/**
 * Returns all documents for a vehicle, including file format.
 */
export const getDocumentsForVehicle = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  const userId = (req.user as any).userId;

  // Ensure the vehicle belongs to the user
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: Number(vehicleId) },
  });
  if (!vehicle || vehicle.userId !== userId)
    return res.status(404).json({ message: "Vehicle not found" });

  const docs = await prisma.document.findMany({
    where: { vehicleId: Number(vehicleId) },
    orderBy: { uploadedAt: "desc" },
  });

  const docsWithFormat = docs.map((doc) => ({
    ...doc,
    fileFormat: doc.filename.split(".").pop() || null,
  }));

  res.json(docsWithFormat);
};
