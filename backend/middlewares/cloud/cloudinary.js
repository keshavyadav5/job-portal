import {v2 as cloudinary} from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadMedia = async (file) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(file, {
      resource_type: "auto"
    });
    return uploadResponse;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error("Error uploading media to Cloudinary");
  }
};

export const deleteMedia = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    throw new Error("Error deleting media from Cloudinary");
  }
};

export const deleteVideo = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: 'video'
    });
  } catch (error) {
    console.error("Cloudinary Video Delete Error:", error);
    throw new Error("Error deleting video from Cloudinary");
  }
};




