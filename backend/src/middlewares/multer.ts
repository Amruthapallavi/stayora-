import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary";

const govtIdStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "stayora/govtId", 
    format: file.mimetype === "application/pdf" ? "pdf" : "png", 
    resource_type: file.mimetype === "application/pdf" ? "raw" : "image", 
  }),
});

const serviceImageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "stayora/serviceImages", 
    format: "png", 
    resource_type: "image",
  }),
});

const propertyImageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "stayora/propertyImages", 
    format: "png", 
    resource_type: "image", 
  }),
});
const messageImageStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "stayora/messageImages", 
    format: "png", 
    resource_type: "image", 
  }),
});

const uploadGovtId = multer({ storage: govtIdStorage });
const uploadServiceImage = multer({ storage: serviceImageStorage });
const uploadPropertyImage = multer({ storage: propertyImageStorage });
const uploadMessageImages = multer({storage:messageImageStorage})
export { uploadGovtId, uploadServiceImage, uploadPropertyImage ,uploadMessageImages };
