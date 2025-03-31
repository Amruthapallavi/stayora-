import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

// Storage for Govt ID Uploads
const govtIdStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "stayora/govtId", 
    format: file.mimetype === "application/pdf" ? "pdf" : "png", 
    resource_type: file.mimetype === "application/pdf" ? "raw" : "image", 
  }),
});

// Storage for Service Image Uploads
const serviceImageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "stayora/serviceImages", // Different folder for service images
    format: "png", // Ensure images are stored as PNG
    resource_type: "image", // Only images
  }),
});

// Middleware for uploading different files
const uploadGovtId = multer({ storage: govtIdStorage });
const uploadServiceImage = multer({ storage: serviceImageStorage });

export { uploadGovtId, uploadServiceImage };
