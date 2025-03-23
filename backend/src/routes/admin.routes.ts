import { Router } from "express";
import adminController from "../controllers/admin.controller";
import passport from "../config/passport";
import { authMiddleware } from "../middlewares/auth.middleware";

const adminRoutes = Router();

adminRoutes.post("/login", adminController.login);

adminRoutes.get("/users",adminController.listAllUsers);
adminRoutes.get("/owners",adminController.listAllOwners);

adminRoutes.post("/add-service",adminController.addService);
adminRoutes.get("/services",adminController.listServices);
adminRoutes.patch("/services/status/:id",adminController.updateServiceStatus);
adminRoutes.get("/features",adminController.listFeatures);
adminRoutes.post("/add-feature",adminController.addFeature);
adminRoutes.patch("/owners/status/:id",adminController.updateOwnerStatus);
adminRoutes.post("/owners/status/",adminController.addFeature);
adminRoutes.post("/add-feature",adminController.addFeature);
adminRoutes.patch("/owners/approve/:id",adminController.approveOwner);
adminRoutes.patch("/owners/reject/:id",adminController.rejectOwner);

adminRoutes.patch("/users/status/:id",adminController.updateUserStatus);
adminRoutes.post("/owners/delete/:id",adminController.deleteOwner);
adminRoutes.post("/features/delete/:id",adminController.removeFeature);
adminRoutes.post("/logout", adminController.logout);

export default adminRoutes;