import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "stayora/govtId", 
    format: file.mimetype === "application/pdf" ? "pdf" : "png", 
    resource_type: file.mimetype === "application/pdf" ? "raw" : "image", 
  }),
});

const upload = multer({ storage });

export default upload;
