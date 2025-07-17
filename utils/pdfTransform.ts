import { execSync } from "child_process";
import fs from "fs";
import path from "path";

export async function convertPdfToImages(
  pdfBuffer: Buffer,
  outputDir: string
): Promise<string[]> {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const tempPdfPath = path.join(outputDir, "temp.pdf");
  fs.writeFileSync(tempPdfPath, pdfBuffer);

  // Convert PDF to JPEG image
  execSync(`pdftoppm -jpeg "${tempPdfPath}" "${path.join(outputDir, "page")}"`);

  // Get all generated images
  const images = fs
    .readdirSync(outputDir)
    .filter((f) => f.endsWith(".jpg"))
    .map((f) => path.join(outputDir, f));

  // Later decide if the pdf is deleted or image is deleted
  // fs.unlinkSync(tempPdfPath);

  return images;
}
