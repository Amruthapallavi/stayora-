import { Router } from "express";
import adminController from "../controllers/admin.controller";
import passport from "../config/passport";

const adminRoutes = Router();

adminRoutes.post("/login", adminController.login);

// userRoutes.post("/logout", userController.logout);

export default adminRoutes;