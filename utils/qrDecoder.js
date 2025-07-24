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
exports.decodeQR = void 0;
const jimp_1 = require("jimp");
const jsqr_1 = __importDefault(require("jsqr"));
const decodeQR = (imagePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const image = yield jimp_1.Jimp.read(imagePath);
        const imageData = {
            data: new Uint8ClampedArray(image.bitmap.data),
            width: image.bitmap.width,
            height: image.bitmap.height,
        };
        const decodedQR = (0, jsqr_1.default)(imageData.data, imageData.width, imageData.height);
        if (!decodedQR) {
            throw new Error("QR code not found in the image.");
        }
        return decodedQR.data;
    }
    catch (error) {
        console.error("Error decoding QR code:", error);
        return "";
    }
});
exports.decodeQR = decodeQR;
