import { Router } from "express";
import adminController from "../controllers/admin.controller";
import passport from "../config/passport";
import {uploadServiceImage} from "../middlewares/multer";
import { authMiddleware } from "../middlewares/auth.middleware";
import {verifyToken} from "../middlewares/authmid";
import serviceController from "../controllers/service.controller";
import propertyController from "../controllers/property.controller";
const adminRoutes = Router();

adminRoutes.post("/login",
adminController.login);

adminRoutes.get("/users",   
     authMiddleware(["admin"]),
     adminController.listAllUsers);
adminRoutes.get("/owners",
    authMiddleware(["admin"]),

    adminController.listAllOwners);

adminRoutes.post("/add-service",authMiddleware(["admin"]),uploadServiceImage.single("serviceImage"),serviceController.createService);
adminRoutes.get("/services",authMiddleware(["admin"]),serviceController.listServices);
adminRoutes.get("/all-Properties",authMiddleware(["admin"]),propertyController.getAllProperties);
adminRoutes.post("/refresh-token", adminController.refreshToken);
adminRoutes.get("/dashboard",authMiddleware(["admin"]),adminController.getDashboardData);

adminRoutes.patch("/services/status/:id",authMiddleware(["admin"]),adminController.updateServiceStatus);
adminRoutes.get("/features",authMiddleware(["admin"]),adminController.listFeatures);
adminRoutes.post("/add-feature",authMiddleware(["admin"]),adminController.addFeature);
adminRoutes.patch("/owners/status/:id",authMiddleware(["admin"]),adminController.updateOwnerStatus);
adminRoutes.post("/owners/status/",authMiddleware(["admin"]),adminController.addFeature);
adminRoutes.post("/add-feature",authMiddleware(["admin"]),adminController.addFeature);
adminRoutes.patch("/owners/approve/:id",authMiddleware(["admin"]),adminController.approveOwner);
adminRoutes.patch("/owners/reject/:id",authMiddleware(["admin"]),adminController.rejectOwner);
adminRoutes.patch("/features/:id",authMiddleware(["admin"]),adminController.updateFeature);
adminRoutes.patch("/users/status/:id",authMiddleware(["admin"]),adminController.updateUserStatus);
adminRoutes.post("/owners/delete/:id",authMiddleware(["admin"]),adminController.deleteOwner);
adminRoutes.post("/features/delete/:id",authMiddleware(["admin"]),adminController.removeFeature);
adminRoutes.patch("/properties/reject/:id",authMiddleware(["admin"]),adminController.rejectProperty);
adminRoutes.get("/property/:id",authMiddleware(["admin"]),adminController.getPropertyById);

adminRoutes.patch("/properties/approve/:id", authMiddleware(["admin"]), adminController.approveProperty);
adminRoutes.patch('/properties/status/:id', authMiddleware(["admin"]), adminController.blockUnblockProperty);
adminRoutes.delete('/properties/:id', authMiddleware(['admin']), adminController.deleteProperty);
adminRoutes.get("/bookings",authMiddleware(["admin"]),adminController.listAllBookings);
adminRoutes.get("/bookings/:id",authMiddleware(["admin"]),adminController.bookingDetails);

adminRoutes.post("/logout", adminController.logout);

export default adminRoutes;