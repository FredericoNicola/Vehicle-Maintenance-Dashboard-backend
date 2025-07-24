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
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const router = express_1.default.Router();
// Proxy NIF info from nif.pt
router.get("/:nif", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nif } = req.params;
        const response = yield axios_1.default.get(`https://www.nif.pt/${nif}/`, {
            responseType: "text",
            headers: {
                "User-Agent": "Mozilla/5.0",
            },
        });
        res.send(response.data);
    }
    catch (err) {
        res.status(500).send("Failed to fetch NIF info");
        console.error("Error fetching NIF info:", err);
    }
}));
exports.default = router;
