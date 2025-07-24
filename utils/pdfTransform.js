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
exports.convertPdfToImages = convertPdfToImages;
const child_process_1 = require("child_process");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function convertPdfToImages(pdfBuffer, outputDir) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!fs_1.default.existsSync(outputDir))
            fs_1.default.mkdirSync(outputDir, { recursive: true });
        const tempPdfPath = path_1.default.join(outputDir, "temp.pdf");
        fs_1.default.writeFileSync(tempPdfPath, pdfBuffer);
        // Convert PDF to JPEG image
        (0, child_process_1.execSync)(`pdftoppm -jpeg "${tempPdfPath}" "${path_1.default.join(outputDir, "page")}"`);
        // Get all generated images
        const images = fs_1.default
            .readdirSync(outputDir)
            .filter((f) => f.endsWith(".jpg"))
            .map((f) => path_1.default.join(outputDir, f));
        // Later decide if the pdf is deleted or image is deleted
        // fs.unlinkSync(tempPdfPath);
        return images;
    });
}
