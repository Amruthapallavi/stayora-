import { Request, Response } from "express";
import ownerService from "../services/owner.service";
import { IOwnerController } from "./interfaces/IOwnerController";
import { STATUS_CODES } from "../utils/constants";
import jwt from "jsonwebtoken";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

class OwnerController implements IOwnerController {

  async register(req: Request, res: Response): Promise<void> {
    try {
      const govtIdProof = req.file?.path; // Cloudinary uploaded URL

      if (!govtIdProof) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ error: "Govt ID proof is required" });
        return;
      }

      const result = await ownerService.registerOwner({
        ...req.body,
        govtId: govtIdProof, // Attach uploaded file URL
      });

      res.status(result.status).json({ message: result.message });
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
      console.log(req.body,"reqbody");
      const result = await ownerService.verifyOTP(email, otp);
      console.log(result,"result owner")
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

   async login(req: Request, res: Response): Promise<void> {
      try {
        const { email, password } = req.body;
        console.log(req.body,"owner login data")
        const result = await ownerService.loginOwner(email, password);
    console.log(result,"login result");
        res.cookie("auth-token", result.token, {
          httpOnly: true,
          secure: Boolean(process.env.NODE_ENV === "production"),
          sameSite: "strict",
          maxAge: 3600000, // 1 hour
          path: "/",
        });
    
        res.status(result.status).json({
          message: result.message,
          owner: {
            id: result.owner._id,
            name: result.owner.name,
            email: result.owner.email,
            phone: result.owner.phone,
            status: result.owner.status,
          },
        });
      } catch (error) {
        console.error("Login error:", error);
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error:
            error instanceof Error ? error.message : "Invalid Credentials...Please try again",
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
      
          const result = await ownerService.resendOTP(email);
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
            console.log(req.body)
            if(!email || !newPassword ){
                res.status(STATUS_CODES.BAD_REQUEST).json({
                  error: "Email and password is required",
                });
                return;
              }
              const result = await ownerService.resetPassword(email,newPassword);
            res.status(result.status).json({
              message:result.message,
            })
          } catch (error) {
            console.log(error);
            throw error;
          }
       
      
        }
}



export default new OwnerController();










































//   async resendOTP(req: Request, res: Response): Promise<void> {
//     try {
//       const { email } = req.body;

//       if (!email) {
//         res.status(STATUS_CODES.BAD_REQUEST).json({
//           error: "Email is required",
//         });
//         return;
//       }

//       const result = await userService.resendOTP(email);
//       res.status(result.status).json({
//         message: result.message,
//       });
//     } catch (error) {
//       console.error("OTP resend error:", error);
//       res.status(STATUS_CODES.BAD_REQUEST).json({
//         error: error instanceof Error ? error.message : "Failed to resend OTP",
//       });
//     }
//   }
//   async login(req: Request, res: Response): Promise<void> {
//     try {
//       const { email, password } = req.body;
//       const result = await userService.loginUser(email, password);
//       res.cookie("auth-token", result.token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//         maxAge: 3600000,
//         path: "/",
//       });
//       res.status(result.status).json({
//         message: result.message,
//         user: {
//           id: result.user._id,
//           name: result.user.name,
//           email: result.user.email,
//           phone: result.user.phone,
//           status: result.user.status,
//         },
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(STATUS_CODES.UNAUTHORIZED).json({
//         error: error instanceof Error ? error.message : "Login Failed",
//       });
//     }
//   }
//   async googleCallback(req: Request, res: Response): Promise<void> {
//     try {
//       const user = req.user as any;
//       const result = await userService.processGoogleAuth(user);
//       res.cookie("auth-token", result.token, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === "production",
//         sameSite: "strict",
//         maxAge: 3600000,
//         path: "/",
//       });

//       res.status(result.status).json({
//         message: result.message,
//         user: {
//           id: result.user._id,
//           name: result.user.name,
//           email: result.user.email,
//         },
//       });
//     } catch (error) {
//       console.error("Google auth error:", error);
//       res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
//         error:
//           error instanceof Error
//             ? error.message
//             : "Google Authentication Failed",
//       });
//     }
//   }
//   async logout(req: Request, res: Response): Promise<void> {
//     res.clearCookie("auth-token", {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       path: "/",
//     });

//     res.status(STATUS_CODES.OK).json({
//       message: "Logged out successfully",
//     });
//   }
// }