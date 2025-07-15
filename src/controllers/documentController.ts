import { Request, Response } from "express";
import prisma from "../../utils/prisma";
import fs from "fs";
import path from "path";
import { convertPdfToImages } from "../../utils/pdfTransform";
import { decodeQR } from "../../utils/qrRender";

function parseQRCodeString(qrString: string): Record<string, string> {
  const pairs = qrString.split("*");
  const result: Record<string, string> = {};
  for (const pair of pairs) {
    const [key, ...rest] = pair.split(":");
    if (key && rest.length) {
      result[key] = rest.join(":");
    }
  }
  return result;
}

export const uploadDocument = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  const userId = (req.user as any).userId;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Ensure the vehicle belongs to the logged-in user
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: Number(vehicleId) },
  });
  if (!vehicle || vehicle.userId !== userId) {
    return res.status(404).json({ message: "Vehicle not found" });
  }

  let qrCodeString = "";
  let qrCodeData = null;

  try {
    const ext = path.extname(req.file.originalname).toLowerCase();
    if (ext === ".pdf") {
      // Convert PDF to images
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
        if (qr) {
          qrCodeString = qr;
          break;
        }
      }
      // Optionally, clean up images after processing
      // fs.rmSync(outputDir, { recursive: true, force: true });
    } else if ([".jpg", ".jpeg", ".png"].includes(ext)) {
      qrCodeString = await decodeQR(req.file.path);
    }

    if (qrCodeString) {
      qrCodeData = parseQRCodeString(qrCodeString);
    }

    const doc = await prisma.document.create({
      data: {
        filename: req.file.originalname,
        url: `/uploads/${req.file.filename}`,
        vehicleId: Number(vehicleId),
        qrCode: qrCodeString || null,
        ...(qrCodeData ? { qrCodeData } : {}),
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

export const getDocumentsForVehicle = async (req: Request, res: Response) => {
  const { vehicleId } = req.params;
  const userId = (req.user as any).userId;

  // Ensure the vehicle belongs to the user
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: Number(vehicleId) },
  });
  if (!vehicle || vehicle.userId !== userId) {
    return res.status(404).json({ message: "Vehicle not found" });
  }

  const docs = await prisma.document.findMany({
    where: { vehicleId: Number(vehicleId) },
    orderBy: { uploadedAt: "desc" },
  });

  // Add fileFormat property to each document
  const docsWithFormat = docs.map((doc) => ({
    ...doc,
    fileFormat: doc.filename.split(".").pop() || null,
  }));

  res.json(docsWithFormat);
};
