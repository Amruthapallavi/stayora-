import { Request, Response } from "express";
import userService from "../services/user.service";
import { IUserController } from "./interfaces/IUserController";
import { STATUS_CODES } from "../utils/constants";
import dotenv from "dotenv";
dotenv.config();

import jwt from "jsonwebtoken";

class UserController implements IUserController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const result = await userService.registerUser(req.body);
      console.log(req.body)
      res.status(result.status).json({
        message: result.message,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error: error instanceof Error ? error.message : "Registration failed",
      });
    }
  }

  async verifyOTP(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp } = req.body;
      console.log(req.body,"reqbody")
      const result = await userService.verifyOTP(email, otp);
      res.status(result.status).json({
        message: result.message,
      });
    } catch (error) {
      console.error("OTP verification error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error ? error.message : "OTP verification failed",
      });
    }
  }

  async resendOTP(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      console.log(email,"for resent otp")
      if (!email) {
       throw new Error("email is required");
      }

      const result = await userService.resendOTP(email);
      res.status(result.status).json({
        message: result.message,
      });
    } catch (error) {
      console.error("OTP resend error:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error: error instanceof Error ? error.message : "Failed to resend OTP",
      });
    }
  }
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await userService.loginUser(email, password);
  
      res.cookie("auth-token", result.token, {
        httpOnly: true,
        secure: Boolean(process.env.NODE_ENV === "production"),
        sameSite: "strict",
        maxAge: 3600000, // 1 hour
        path: "/",
      });
  
      res.status(result.status).json({
        message: result.message,
        user: {
          id: result.user._id,
          name: result.user.name,
          email: result.user.email,
          phone: result.user.phone,
          status: result.user.status,
        },
      });
    } catch (error) {
      console.error("Login Error: ", error);
      res.status(STATUS_CODES.UNAUTHORIZED).json({
        error: error instanceof Error ? error.message : "Login Failed",
      });
    }
  }
  async googleCallback(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as any;
      if (!user) {
        return res.redirect(`${process.env.FRONTEND_URL}/signup?error=user_not_found`);
      }
      console.log(user)
      console.log("Checking Google authentication...");
  
      const result = await userService.processGoogleAuth(user);
  
      if (!result.token) {
        // If no token, redirect to signup page
        console.warn("No token found, redirecting to signup/login.");
        return res.redirect(`${process.env.FRONTEND_URL}/signup?message=${encodeURIComponent(result.message)}`);
      }
  
      // Set authentication token in cookies
      res.cookie("auth-token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600000,
        path: "/",
      });
  
      console.log("Generated Token:", result.token);
  
      // Redirect to frontend callback with token
      res.redirect(
        `${process.env.FRONTEND_URL}/auth/google/callback?token=${result.token}`
      );
    } catch (error) {
      console.error("Google auth error:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error
            ? error.message
            : "Google Authentication Failed",
      });
    }
  }
  


  async  forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      console.log(email, "from req.body");
  
      if (!email) {
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "Email is required",
        });
        return;
      }
  
      const result = await userService.resendOTP(email);
    console.log(result,"from")
      res.status(result.status).json({
        message: result.message,
      });
    } catch (error) {
      console.error("OTP resend error:", error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : "Failed to resend OTP",
      });
    }
  }
  
  async resetPassword(req:Request , res:Response) :Promise<void>{
    try {
      const {email,newPassword}= req.body;
      if(!email || !newPassword ){
          res.status(STATUS_CODES.BAD_REQUEST).json({
            error: "Email and password is required",
          });
          return;
        }
        const result = await userService.resetPassword(email,newPassword);
      res.status(result.status).json({
        message:result.message,
      })
    } catch (error) {
      console.log(error);
      throw error;
    }
 

  }

  async getHomeData(req: Request, res: Response): Promise<void> {
    try {
      
    } catch (error) {
      console.log(error)
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    
    res.clearCookie("auth-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.status(STATUS_CODES.OK).json({
      message: "Logged out successfully",
    });
  }
}

export default new UserController();