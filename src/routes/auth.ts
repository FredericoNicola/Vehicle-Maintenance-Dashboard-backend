import express from "express";
import { loginUser, registerUser } from "../controllers/authController";

const router = express.Router();

import { RequestHandler } from "express";

router.post("/register", registerUser as RequestHandler);
router.post("/login", loginUser as RequestHandler);

export default router;
