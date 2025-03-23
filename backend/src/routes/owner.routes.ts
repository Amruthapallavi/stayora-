import { Request, Response, Router } from "express";
import ownerController from "../controllers/owner.controller";
import passport from "../config/passport";
import upload from "../middlewares/multer";
import { verifyToken } from "../middlewares/authmid";

const ownerRoutes = Router();

ownerRoutes.post("/signup",upload.single("z"), ownerController.register);
ownerRoutes.post("/login",ownerController.login);
ownerRoutes.post("/forgot-pass",ownerController.forgotPassword);
// ownerRoutes.post("resend-otp",ownerController.resendOTP);
ownerRoutes.post("/reset-password",ownerController.resetPassword);

ownerRoutes.get("/home", verifyToken, async (req: Request , res: Response) => {
    try {
      const ownerId = (req as any).user.id; // ✅ TypeScript fix for user property
      console.log(ownerId,"hiiiiiiiiiiiiiiii")
    //   const owner = await Owner.findById(ownerId).select("isVerified name email");
  
    //   if (!owner) {
    //     return res.status(404).json({ error: "Owner not found" });
    //   }
  
    //   res.json(owner);
    } catch (error) {
    //   res.status(500).json({ error: "Server error" });
    }
  });




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