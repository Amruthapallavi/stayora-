import { Router } from "express";
import userController from "../controllers/user.controller";
import passport from "../config/passport";
import dotenv from "dotenv";
dotenv.config();
const userRoutes = Router();

userRoutes.post("/signup", userController.register);
userRoutes.post("/login", userController.login);
userRoutes.post("/verify-otp", userController.verifyOTP);
userRoutes.post("/resend-otp", userController.resendOTP);
userRoutes.post("/forgot-pass", userController.forgotPassword);
userRoutes.post("/reset-password", userController.resetPassword);
userRoutes.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
userRoutes.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/user/login`
  }),
  userController.googleCallback
);


userRoutes.get(
  "/home",
  userController.getHomeData
);
userRoutes.post("/logout", userController.logout);

export default userRoutes;