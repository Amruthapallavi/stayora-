import { Router } from "express";
import ownerController from "../controllers/owner.controller";
import passport from "../config/passport";
import { uploadGovtId, uploadPropertyImage, uploadServiceImage } from "../middlewares/multer";
// import { verifyToken } from "../middlewares/authmid";
import { authMiddleware } from "../middlewares/auth.middleware";
import propertyController from "../controllers/property.controller";
import bookingController from "../controllers/booking.controller";
import featureController from "../controllers/feature.controller";
import adminController from "../controllers/admin.controller";
import chatController from "../controllers/chat.controller";

const ownerRoutes = Router();

ownerRoutes.post("/signup",uploadGovtId.single("govtId"), ownerController.register);
ownerRoutes.post("/login",ownerController.login);
ownerRoutes.get("/check-status/:id",authMiddleware(["owner"]),ownerController.getOwnerStatus);
ownerRoutes.post("/refresh-token", adminController.refreshToken);
ownerRoutes.post("/forgot-pass",ownerController.forgotPassword);
ownerRoutes.post("/resend-otp",ownerController.resendOTP);
ownerRoutes.post("/reset-password",ownerController.resetPassword);

ownerRoutes.get("/dashboard",authMiddleware(["owner"]),ownerController.getDashboardData);
ownerRoutes.get("/profile/:id",authMiddleware(["owner"]),ownerController.getProfileData);
ownerRoutes.patch("/profile/:id",authMiddleware(["owner"]),ownerController.updateProfile);
ownerRoutes.get("/property/:id",authMiddleware(["owner"]),ownerController.getPropertyById);
ownerRoutes.patch("/property/update/:id",authMiddleware(["owner"]),ownerController.updateProperty);
ownerRoutes.get("/wallet/:id",authMiddleware(["owner"]),ownerController.fetchWalletData);

ownerRoutes.get("/features",authMiddleware(["owner"]),uploadPropertyImage.array("images") 
,featureController.listFeatures);
ownerRoutes.post( 
    "/add-property",
    authMiddleware(["owner"]),
    uploadPropertyImage.array("images"), 
    propertyController.createProperty 
  );
ownerRoutes.get("/bookings",authMiddleware(["owner"]),bookingController.listBookingsByOwner);
ownerRoutes.get("/bookings/:id",authMiddleware(["owner"]),bookingController.bookingDetails);

ownerRoutes.get("/get-Owner-Properties",authMiddleware(["owner"]),propertyController.getPropertyByOwner)
ownerRoutes.post("/verify-otp", ownerController.verifyOTP);
ownerRoutes.post("/logout",ownerController.logout);
ownerRoutes.delete('/delete/:id', authMiddleware(['owner']), propertyController.deletePropertyById);
ownerRoutes.get("/conversation",authMiddleware(['owner']),chatController.getConversation);
ownerRoutes.post("/message",authMiddleware(['owner']),chatController.sendMessage);
ownerRoutes.patch("/messages/mark-as-read", authMiddleware(["owner"]),chatController.markMessagesAsRead);

ownerRoutes.get("/conversations",authMiddleware(['owner']),chatController.listConversations);

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