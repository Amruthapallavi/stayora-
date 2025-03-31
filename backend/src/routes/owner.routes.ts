import { Request, Response, Router } from "express";
import ownerController from "../controllers/owner.controller";
import passport from "../config/passport";
import { uploadGovtId, uploadServiceImage } from "../middlewares/multer";
import { verifyToken } from "../middlewares/authmid";
import { authMiddleware } from "../middlewares/auth.middleware";

const ownerRoutes = Router();

ownerRoutes.post("/signup",uploadGovtId.single("govtId"), ownerController.register);
ownerRoutes.post("/login",ownerController.login);
ownerRoutes.post("/forgot-pass",ownerController.forgotPassword);
ownerRoutes.post("/resend-otp",ownerController.resendOTP);
ownerRoutes.post("/reset-password",ownerController.resetPassword);
ownerRoutes.get("/profile/:id",authMiddleware(["owner"]),ownerController.getProfileData);
ownerRoutes.patch("/profile/:id",authMiddleware(["owner"]),ownerController.updateProfile);

ownerRoutes.get("/features",authMiddleware(["owner"]),ownerController.listFeatures);
ownerRoutes.post("/add-property",authMiddleware(["owner"]),ownerController.addProperty);

ownerRoutes.post("/verify-otp", ownerController.verifyOTP);
ownerRoutes.post("/logout",ownerController.logout);

export default ownerRoutes;






















// userRoutes.post("/resend-otp", userController.resendOTP);

// userRoutes.get(
//   "/auth/google",
//   passport.authenticate("google", { scope: ["profile", "email"] })
// );
// userRoutes.get(
//   "/auth/google/callback",
//   passport.authenticate("google", {
//     session: false,
//     failureRedirect: "/login",
//   }),
//   userController.googleCallback
// );
// userRoutes.post("/logout", userController.logout);