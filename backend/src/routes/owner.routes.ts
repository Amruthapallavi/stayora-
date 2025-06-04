import { Router } from "express";
import container from "../config/DI/inversify";
import TYPES from "../config/DI/types";
import  OwnerController from "../controllers/owner.controller";
import passport from "../config/passport";
import { uploadGovtId, uploadPropertyImage, uploadServiceImage } from "../middlewares/multer";
// import { verifyToken } from "../middlewares/authmid";
import { authMiddleware } from "../middlewares/auth.middleware";
import BookingController from "../controllers/booking.controller";
import ChatController from "../controllers/chat.controller";
import PropertyController from "../controllers/property.controller";
import NotificationController from "../controllers/notification.controller";
import FeatureController from "../controllers/feature.controller";
// import propertyController from "../controllers/property.controller";
// import bookingController from "../controllers/booking.controller";
// import featureController from "../controllers/feature.controller";
// import adminController from "../controllers/admin.controller";
// import chatController from "../controllers/chat.controller";
// import notificationController from "../controllers/notification.controller";

const ownerRoutes = Router();

const ownerCtr = container.get<OwnerController>(TYPES.OwnerController);
const bookingCtr = container.get<BookingController>(TYPES.BookingController);
const chatCtr = container.get<ChatController>(TYPES.ChatController);
const propertyCtr = container.get<PropertyController>(TYPES.PropertyController);
const notificationCtr = container.get<NotificationController>(TYPES.NotificationController);
const featureCtr = container.get<FeatureController>(TYPES.FeatureController);



ownerRoutes.post("/signup",uploadGovtId.single("govtId"), ownerCtr.register.bind(ownerCtr));
ownerRoutes.post("/login",ownerCtr.login.bind(ownerCtr));
ownerRoutes.get("/check-status/:id",authMiddleware(["owner"]),ownerCtr.getOwnerStatus.bind(ownerCtr));
// ownerRoutes.post("/refresh-token", ownerController.refreshToken);
ownerRoutes.post("/forgot-pass",ownerCtr.forgotPassword.bind(ownerCtr));
ownerRoutes.post("/resend-otp",ownerCtr.resendOTP.bind(ownerCtr));
ownerRoutes.post("/reset-password",ownerCtr.resetPassword.bind(ownerCtr));

ownerRoutes.get("/dashboard",authMiddleware(["owner"]),ownerCtr.getDashboardData.bind(ownerCtr));
ownerRoutes.get("/profile/:id",authMiddleware(["owner"]),ownerCtr.getProfileData.bind(ownerCtr));
ownerRoutes.patch("/profile/:id",authMiddleware(["owner"]),ownerCtr.updateProfile.bind(ownerCtr));
ownerRoutes.get("/property/:id",authMiddleware(["owner"]),ownerCtr.getPropertyById.bind(ownerCtr));
ownerRoutes.patch("/property/update/:id",authMiddleware(["owner"]),ownerCtr.updateProperty.bind(ownerCtr));
ownerRoutes.get("/wallet/:id",authMiddleware(["owner"]),ownerCtr.fetchWalletData.bind(ownerCtr));
ownerRoutes.patch("/change-password/:id",authMiddleware(["owner"]), ownerCtr.changePassword.bind(ownerCtr));
ownerRoutes.post("/subscription",authMiddleware(["owner"]),ownerCtr.subscription.bind(ownerCtr));
ownerRoutes.post("/verify-subscription",authMiddleware(["owner"]),ownerCtr.verifySubscription.bind(ownerCtr));

ownerRoutes.get("/features",authMiddleware(["owner"])
,featureCtr.listFeatures.bind(featureCtr));
ownerRoutes.post( 
    "/add-property",
    authMiddleware(["owner"]),
    uploadPropertyImage.array("images"), 
    propertyCtr.createProperty.bind(propertyCtr) 
  );
ownerRoutes.get("/bookings",authMiddleware(["owner"]),bookingCtr.listBookingsByOwner.bind(bookingCtr));
ownerRoutes.get("/bookings/:id",authMiddleware(["owner"]),bookingCtr.bookingDetails.bind(bookingCtr));

ownerRoutes.get("/get-Owner-Properties",authMiddleware(["owner"]),propertyCtr.getPropertyByOwner.bind(propertyCtr))
ownerRoutes.post("/verify-otp", ownerCtr.verifyOTP.bind(ownerCtr));
ownerRoutes.post("/logout",ownerCtr.logout);
ownerRoutes.delete('/delete/:id', authMiddleware(['owner']), propertyCtr.deletePropertyById.bind(propertyCtr));
ownerRoutes.post("/bookings/cancel/:id",authMiddleware(["owner"]), bookingCtr .cancelBooking.bind(bookingCtr));

ownerRoutes.get("/conversation",authMiddleware(['owner']),chatCtr.getConversation.bind(chatCtr));
ownerRoutes.post("/message",authMiddleware(['owner']),chatCtr.sendMessage.bind(chatCtr));
ownerRoutes.patch("/messages/mark-as-read", authMiddleware(["owner"]),chatCtr.markMessagesAsRead.bind(chatCtr));

ownerRoutes.get("/conversations",authMiddleware(['owner']),chatCtr.listConversations.bind(chatCtr));
ownerRoutes.get("/notifications", authMiddleware(["owner"]), notificationCtr.getNotifications.bind(notificationCtr));
ownerRoutes.patch("/notifications/:notificationId/read",authMiddleware(["owner"]),notificationCtr.markNotificationAsRead.bind(notificationCtr));

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