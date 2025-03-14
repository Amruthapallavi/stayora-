import { Router } from "express";
import ownerController from "../controllers/owner.controller";
import passport from "../config/passport";

const ownerRoutes = Router();

ownerRoutes.post("/signup", ownerController.register);
// ownerRoutes.post("/login", userController.login);









ownerRoutes.post("/verify-otp", ownerController.verifyOTP);


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