import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const createNameAlias = (name) => {
  if (!name) return "";
  let nameAlias = name.toLowerCase();
  nameAlias = nameAlias.replace(/[^a-zA-Z0-9]/g, "-");
  nameAlias = nameAlias.replace(/-{2,}/g, "-");
  nameAlias = nameAlias.replace(/^-+|-+$/g, "");
  return nameAlias;
};

export const uploadImagesToCloudinary = async (imageFiles) => {
  const uploadedImages = [];

  for (const file of imageFiles) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "library/books",
      });

      uploadedImages.push({
        path: result.secure_url,
        publicId: result.publicId,
        isPrimary: uploadedImages.length === 0,
      });

      fs.unlinkSync(file.path);
    } catch (error) {
      for (const img of uploadedImages) {
        await cloudinary.uploader.destroy(img.publicId);
      }
      throw error;
    }
  }

  return uploadedImages;
};

export const deleteImagesFromCloudinary = async (images) => {
  for (const img of images) {
    if (img.publicId) {
      await cloudinary.uploader.destroy(img.publicId);
    }
  }
};
