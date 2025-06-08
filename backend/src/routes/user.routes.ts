import { Router } from "express";
import container from "../config/DI/inversify";
import TYPES from "../config/DI/types";
import passport from "../config/passport";
import { authMiddleware } from "../middlewares/auth.middleware";
import  UserController  from "../controllers/user.controller";
import ChatController from "../controllers/chat.controller";
import BookingController from "../controllers/booking.controller";
import PropertyController from "../controllers/property.controller";
import NotificationController from "../controllers/notification.controller";
import { uploadMessageImages } from "../middlewares/multer";
// import bookingCtr from "../controllers/booking.controller";
// import chatController from "../controllers/chat.controller";
// import propertyController from "../controllers/property.controller";
// import notificationController from "../controllers/notification.controller";
const userRoutes = Router();

const userCtr = container.get<UserController>(TYPES.UserController );
const chatCtr = container.get<ChatController>(TYPES.ChatController);
const bookingCtr = container.get<BookingController>(TYPES.BookingController);
const propertyCtr = container.get<PropertyController>(TYPES.PropertyController);
const notificationCtr = container.get<NotificationController>(TYPES.NotificationController);


userRoutes.post("/signup",  userCtr .register.bind(userCtr));
userRoutes.post("/login",  userCtr .login.bind(userCtr));
userRoutes.post("/verify-otp",  userCtr .verifyOTP.bind(userCtr));
userRoutes.post("/resend-otp",  userCtr .resendOTP.bind(userCtr));
userRoutes.post("/forgot-pass",  userCtr .forgotPassword.bind(userCtr));
userRoutes.post("/reset-password",  userCtr .resetPassword.bind(userCtr));
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
   userCtr .googleCallback
);


userRoutes.get(
  "/home",
   userCtr .getHomeData
);

userRoutes.get("/check-status/:id",authMiddleware(["user"]),userCtr.getUserStatus.bind(userCtr));
userRoutes.patch("/profile/:id",authMiddleware(["user"]),userCtr.updateProfile.bind(userCtr));
userRoutes.get('/property/filtered',authMiddleware(["user"]), propertyCtr.getFilteredProperties.bind(propertyCtr));

userRoutes.get("/all-Properties",authMiddleware(["user"]),userCtr.getAllProperties.bind(userCtr));

userRoutes.get("/property/:id",authMiddleware(["user"]),userCtr.getPropertyById.bind(userCtr));
userRoutes.post("/logout",  userCtr .logout);
userRoutes.get("/profile/:id",authMiddleware(["user"]),userCtr.getProfileData.bind(userCtr));

userRoutes.get("/checkout/:id",authMiddleware(["user"]), userCtr.getCartData.bind(userCtr));
userRoutes.post("/checkout/save-booking-dates",authMiddleware(["user"]), userCtr .saveBookingDates.bind(userCtr))
userRoutes.get("/services",authMiddleware(["user"]), userCtr .listServices.bind(userCtr));
userRoutes.post("/checkout/save-addons",authMiddleware(["user"]), userCtr .saveAddOnServices.bind(userCtr));
userRoutes.post("/razorpay/order/:id",authMiddleware(["user"]),bookingCtr.createBooking.bind(bookingCtr));
userRoutes.post("/razorpay/verify",authMiddleware(["user"]),bookingCtr.verifyPayment.bind(bookingCtr));
userRoutes.get("/bookings",authMiddleware(["user"]), userCtr .getUserBookings.bind(userCtr));
userRoutes.post("/wallet/place-order/:id",authMiddleware(["user"]),bookingCtr.bookingFromWallet.bind(bookingCtr));
userRoutes.get("/bookings/:id",authMiddleware(["user"]),bookingCtr.userBookingDetails.bind(bookingCtr));
userRoutes.post("/bookings/cancel/:id",authMiddleware(["user"]), userCtr .cancelBooking.bind(userCtr));
userRoutes.patch("/change-password/:id",authMiddleware(["user"]), userCtr .changePassword.bind(userCtr));
userRoutes.get("/wallet/:id",authMiddleware(["user"]), userCtr .fetchWalletData.bind(userCtr));
userRoutes.post("/reviews",authMiddleware(['user']),propertyCtr.addReview.bind(propertyCtr));
// userRoutes.get("/chat",authMiddleware(["user"]),chatController.getChat);
userRoutes.post("/message",authMiddleware(['user']),uploadMessageImages.single("image"),chatCtr.sendMessage.bind(chatCtr));
userRoutes.get("/conversation",authMiddleware(['user']),chatCtr.getConversation.bind(chatCtr));
userRoutes.get("/conversations",authMiddleware(['user']),chatCtr.listConversations.bind(chatCtr));
userRoutes.get("/notifications", authMiddleware(["user"]), notificationCtr.getNotifications.bind(notificationCtr));
userRoutes.patch("/messages/mark-as-read", authMiddleware(["user"]),chatCtr.markMessagesAsRead.bind(chatCtr));
userRoutes.get("/reviews/:id",authMiddleware(["user"]), propertyCtr .getReviews.bind(propertyCtr));
// userRoutes.get("/loc-properties",authMiddleware(["user"]),propertyCtr.locationProperties.bind(propertyCtr));
userRoutes.patch("/notifications/:notificationId/read",authMiddleware(["user"]),notificationCtr.markNotificationAsRead.bind(notificationCtr));

 
export default userRoutes;