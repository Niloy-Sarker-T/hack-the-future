import imageCompression from "browser-image-compression";

export const compressFile = async (file) => {
  const compressedFile = await imageCompression(file, {
    maxSizeMB: 2,
    maxWidthOrHeight: 1024,
    useWebWorker: true,
  });

  return compressedFile;
};
