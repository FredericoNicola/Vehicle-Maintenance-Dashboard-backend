import { Router } from "express";
import {
  getDocumentsForVehicle,
  uploadDocument,
} from "../controllers/documentController";
import verifyToken from "../middleware/authMiddleware";
import multer from "multer";
import path from "path";
import prisma from "../../utils/prisma"; // Adjust the import based on your project structure

const router = Router();
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, basename + ext);
  },
});
const upload = multer({ storage });

router.get("/vehicle/:vehicleId", verifyToken, (req, res, next) => {
  Promise.resolve(getDocumentsForVehicle(req, res)).catch(next);
});
router.post(
  "/:vehicleId",
  verifyToken,
  upload.single("file"),
  (req, res, next) => {
    uploadDocument(req, res).catch(next);
  }
);

export default router;
