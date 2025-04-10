import { Router } from "express";
import userController from "../controllers/user.controller";
import passport from "../config/passport";
import dotenv from "dotenv";
import { authMiddleware } from "../middlewares/auth.middleware";
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

userRoutes.get("/check-status/:id",authMiddleware(["user"]),userController.getUserStatus);
userRoutes.patch("/profile/:id",authMiddleware(["user"]),userController.updateProfile);

userRoutes.get("/all-Properties",authMiddleware(["user"]),userController.getAllProperties);
userRoutes.get("/property/:id",authMiddleware(["user"]),userController.getPropertyById);
userRoutes.post("/logout", userController.logout);
userRoutes.get("/profile/:id",authMiddleware(["user"]),userController.getProfileData);

userRoutes.get("/checkout/:id",authMiddleware(["user"]),userController.getCartData);
userRoutes.post("/checkout/save-booking-dates",authMiddleware(["user"]),userController.saveBookingDates)
userRoutes.get("/services",authMiddleware(["user"]),userController.listServices);
userRoutes.post("/checkout/save-addons",authMiddleware(["user"]),userController.saveAddOnServices);
userRoutes.post("/razorpay/order/:id",authMiddleware(["user"]),userController.createRazorpayOrder);
userRoutes.post("/razorpay/verify",authMiddleware(["user"]),userController.verifyRazorpayPayment);
userRoutes.get("/bookings",authMiddleware(["user"]),userController.getUserBookings);
userRoutes.patch("/change-password/:id",authMiddleware(["user"]),userController.changePassword);





export default userRoutes;