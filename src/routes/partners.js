"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const partnerController_1 = require("../controllers/partnerController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware")); // Your JWT/auth middleware
const router = express_1.default.Router();
router.get("/", authMiddleware_1.default, partnerController_1.getPartners);
router.post("/", authMiddleware_1.default, partnerController_1.createPartner);
router.delete("/:id", authMiddleware_1.default, partnerController_1.deletePartner);
router.put("/:id", authMiddleware_1.default, partnerController_1.updatePartner);
exports.default = router;
