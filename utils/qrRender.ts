import { Jimp } from "jimp";
import jsQR from "jsqr";

export const decodeQR = async (imagePath: string): Promise<string> => {
  try {
    const image = await Jimp.read(imagePath); // ✅ Correct usage

    const imageData = {
      data: new Uint8ClampedArray(image.bitmap.data),
      width: image.bitmap.width,
      height: image.bitmap.height,
    };

    const decodedQR = jsQR(imageData.data, imageData.width, imageData.height);

    if (!decodedQR) {
      throw new Error("QR code not found in the image.");
    }

    return decodedQR.data;
  } catch (error) {
    console.error("Error decoding QR code:", error);
    return "";
  }
};
