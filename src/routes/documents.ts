import { Router } from "express";
import {
  getDocumentsForVehicle,
  uploadDocument,
} from "../controllers/documentController";
import verifyToken from "../middleware/authMiddleware";
import multer from "multer";

const router = Router();
const upload = multer({ dest: "uploads/" });

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
