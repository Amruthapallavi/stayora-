import { Router } from "express";
import userController from "../controllers/user.controller";
import passport from "../config/passport";
import dotenv from "dotenv";
import { authMiddleware } from "../middlewares/auth.middleware";
import bookingController from "../controllers/booking.controller";
import chatController from "../controllers/chat.controller";
import propertyController from "../controllers/property.controller";
import notificationController from "../controllers/notification.controller";
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
userRoutes.get('/property/filtered',authMiddleware(["user"]), propertyController.getFilteredProperties);

userRoutes.get("/all-Properties",authMiddleware(["user"]),userController.getAllProperties);

userRoutes.get("/property/:id",authMiddleware(["user"]),userController.getPropertyById);
userRoutes.post("/logout", userController.logout);
userRoutes.get("/profile/:id",authMiddleware(["user"]),userController.getProfileData);

userRoutes.get("/checkout/:id",authMiddleware(["user"]),userController.getCartData);
userRoutes.post("/checkout/save-booking-dates",authMiddleware(["user"]),userController.saveBookingDates)
userRoutes.get("/services",authMiddleware(["user"]),userController.listServices);
userRoutes.post("/checkout/save-addons",authMiddleware(["user"]),userController.saveAddOnServices);
userRoutes.post("/razorpay/order/:id",authMiddleware(["user"]),bookingController.createBooking);
userRoutes.post("/razorpay/verify",authMiddleware(["user"]),bookingController.verifyPayment);
userRoutes.get("/bookings",authMiddleware(["user"]),userController.getUserBookings);
userRoutes.get("/bookings/:id",authMiddleware(["user"]),bookingController.userBookingDetails);
userRoutes.post("/bookings/cancel/:id",authMiddleware(["user"]),userController.cancelBooking);
userRoutes.patch("/change-password/:id",authMiddleware(["user"]),userController.changePassword);
userRoutes.get("/wallet/:id",authMiddleware(["user"]),userController.fetchWalletData);

// userRoutes.get("/chat",authMiddleware(["user"]),chatController.getChat);
userRoutes.post("/message",authMiddleware(['user']),chatController.sendMessage);
userRoutes.get("/conversation",authMiddleware(['user']),chatController.getConversation);
userRoutes.get("/conversations",authMiddleware(['user']),chatController.listConversations);
userRoutes.get("/notifications", authMiddleware(["user"]), notificationController.getNotifications);
userRoutes.patch("/messages/mark-as-read", authMiddleware(["user"]),chatController.markMessagesAsRead);

userRoutes.patch("/notifications/:notificationId/read",authMiddleware(["user"]),notificationController.markNotificationAsRead);

 
export default userRoutes;