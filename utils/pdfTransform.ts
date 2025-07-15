import { execSync } from "child_process";
import fs from "fs";
import path from "path";

/**
 * Converts a PDF to JPEG images using pdftoppm.
 * Returns array of image paths.
 */
export async function convertPdfToImages(
  pdfBuffer: Buffer,
  outputDir: string
): Promise<string[]> {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const tempPdfPath = path.join(outputDir, "temp.pdf");
  fs.writeFileSync(tempPdfPath, pdfBuffer);

  // Convert PDF to JPEG images
  execSync(`pdftoppm -jpeg "${tempPdfPath}" "${path.join(outputDir, "page")}"`);

  // Get all generated images
  const images = fs
    .readdirSync(outputDir)
    .filter((f) => f.endsWith(".jpg"))
    .map((f) => path.join(outputDir, f));

  // Optionally, remove temp PDF
  fs.unlinkSync(tempPdfPath);

  return images;
}
