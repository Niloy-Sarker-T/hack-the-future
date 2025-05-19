import { v2 as cloudinary } from "cloudinary";
import env from "../config/index.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY || env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET || env.CLOUDINARY_API_SECRET,
});

// Utility to upload a buffer to Cloudinary
export function uploadBufferToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });
}

export default cloudinary;
