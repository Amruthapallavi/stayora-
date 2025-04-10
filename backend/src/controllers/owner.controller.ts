import { Request, Response } from "express";
import ownerService from "../services/owner.service";
import { IOwnerController } from "./interfaces/IOwnerController";
import { STATUS_CODES } from "../utils/constants";
import jwt from "jsonwebtoken";
import bookingService from "../services/bookingService";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

class OwnerController implements IOwnerController {

  async register(req: Request, res: Response): Promise<void> {
    try {
      const govtIdProof = req.file?.path; 

      if (!govtIdProof) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ error: "Govt ID proof is required" });
        return;
      }

      const result = await ownerService.registerOwner({
        ...req.body,
        govtId: govtIdProof, 
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
        // req.session.user = result.owner;

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
          async resendOTP(req: Request, res: Response): Promise<void> {
            try {
              const { email } = req.body;
              console.log(req.body,"for resent otp")
              if (!email) {
               throw new Error("email is required");
              }
        
              const result = await ownerService.resendOTP(email);
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

async getProfileData(req:Request, res:Response):Promise<void>{
  try {
    const id=req.params.id;
    console.log(id);
    const result = await ownerService.getProfileData(id);
    console.log(result,"from owner controller");
    res.status(result.status).json({
      user: result.user,
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error instanceof Error ? error.message : "Failed to fetch data",
    });
  }
}
async updateProfile(req:Request,res:Response):Promise<void>{
  try {
    const id= req.params.id;
const formData= req.body;
    if(!id || !formData ){
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "owner not found",
        });
        return;
      }
      console.log(id,formData)
      const result = await ownerService.updateProfile(id,formData);
    res.status(result.status).json({
      message:result.message,
    })
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async addProperty(req: Request, res: Response): Promise<void> {
  try {
    console.log("from controller");

    const data = req.body;
    const ownerId = (req as any).userId; // assuming set from middleware

    // Handle multiple image uploads from Cloudinary
    const uploadedImages = (req.files as Express.Multer.File[] | undefined) || [];

    // Extract image URLs from Cloudinary uploads
    const imageUrls = uploadedImages.map((file: any) => file.path); // 'file.path' holds Cloudinary URL

    console.log("Image URLs:", imageUrls);

    // Pass images along with other data to service
    const result = await ownerService.addProperty({ data, ownerId, images: imageUrls });

    res.status(result.status).json({
      message: result.message,
    });
  } catch (error) {
    console.error("Error adding property:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async listFeatures(req:Request, res:Response):Promise<void>{
  try {
    const result = await ownerService.listFeatures();
    console.log(result,"from owner controller");
    res.status(result.status).json({
      features: result.features,
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error instanceof Error ? error.message : "Failed to fetch features",
    });
  }
}

async ownerProperties(req:Request,res:Response):Promise<void>{
try {
  const ownerId = (req as any).userId; 

const result = await ownerService.ownerProperties(ownerId);
    res.status(result.status).json({
      properties: result.properties,
    });
} catch (error) {
  console.error(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error instanceof Error ? error.message : "Failed to fetch properties",
    });
}
}

async getOwnerStatus(req: Request, res: Response): Promise<any> {
  try {
    const result = await ownerService.getOwnerStatus(req.params.id);

    if (!result.user) {
      return res.status(result.status).json({ message: result.message });
    }
    res.status(result.status).json({
      status: result.user.status, // e.g., "active", "blocked"
      user: result.user._id,
    });
  } catch (err) {
    console.error("Get user status failed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async listAllBookings(req:Request, res:Response):Promise<void>{
  try {
     
    const id=req.params.id;
    console.log(id)
    const result = await bookingService.listBookings(id);
    // console.log(result,"from owner controller");
    res.status(result.status).json({
      bookings: result.bookings,
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error instanceof Error ? error.message : "Failed to fetch bookings",
    });
  }
}
async getPropertyById(req:Request,res:Response):Promise<void>{
  try {
    // const ownerId = (req as any).userId; 

    const id=req.params.id;
    console.log(id);
    const result = await ownerService.getPropertyById(id);
    res.status(result.status).json({
      Property: result.property,
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error instanceof Error ? error.message : "Failed to fetch property",
    });
  }
 }

async deletePropertyById(req: Request, res: Response):Promise<void> {
  try {
    const propertyId = req.params.id;
    await ownerService.deleteProperty(propertyId);
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ message: 'Failed to delete property' });
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