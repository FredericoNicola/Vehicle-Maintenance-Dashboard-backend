import express from "express";
import {
  getPartners,
  createPartner,
  deletePartner,
  updatePartner,
} from "../controllers/partnerController";
import verifyToken from "../middleware/authMiddleware"; // Your JWT/auth middleware

const router = express.Router();

router.get("/", verifyToken, getPartners);
router.post("/", verifyToken, createPartner);
router.delete("/:id", verifyToken, deletePartner);
router.put("/:id", verifyToken, updatePartner);

export default router;
