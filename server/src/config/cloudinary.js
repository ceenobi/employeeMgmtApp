import { v2 as cloudinary } from "cloudinary";

export const uploadToCloudinary = async (file, options = {}) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(file, {
      folder: "emplymgmt",
      resource_type: "auto",
      ...options,
    });
    return {
      url: uploadResponse.secure_url,
      public_id: uploadResponse.public_id,
    };
  } catch (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }
};


export const uploadMultipleToCloudinary = async (files, options = {}) => {
  try {
    const uploadPromises = files.map(file => uploadToCloudinary(file, options));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    throw new Error(`Multiple upload failed: ${error.message}`);
  }
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Deletion failed: ${error.message}`);
  }
};

export const deleteMultipleFromCloudinary = async (publicIds) => {
  try {
    const deletePromises = publicIds.map(publicId => deleteFromCloudinary(publicId));
    const results = await Promise.all(deletePromises);
    return results;
  } catch (error) {
    throw new Error(`Multiple deletion failed: ${error.message}`);
  }
};
