import { Request, Response } from "express";
// import ownerService from "../services/owner.service";
import { IOwnerController } from "./interfaces/IOwnerController";
import { STATUS_CODES } from "../utils/constants";
import jwt from "jsonwebtoken";
// import bookingService from "../services/bookingService";
import propertyService from "../services/property.service";
import { inject, injectable } from "inversify";
import  TYPES  from "../config/DI/types";
import IOwnerService from "../services/interfaces/IOwnerService";
import { IPropertyService } from "../services/interfaces/IPropertyService";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

@injectable()
export class OwnerController implements IOwnerController {
  constructor(
    @inject(TYPES.OwnerService)
      private ownerService: IOwnerService,
      @inject(TYPES.PropertyService)
      private propertyService: IPropertyService
    
  ){}
  async register(req: Request, res: Response): Promise<void> {
    try {
      const govtIdProof = req.file?.path; 

      if (!govtIdProof) {
        res.status(STATUS_CODES.BAD_REQUEST).json({ error: "Govt ID proof is required" });
        return;
      }

      const result = await this.ownerService.registerOwner({
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
      const result = await this.ownerService.verifyOTP(email, otp);
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
        const result = await this.ownerService.loginOwner(email, password,res);
console.log(result.refreshToken,"refreshToken");
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
      
          const result = await this.ownerService.resendOTP(email);
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
              const result = await this.ownerService.resetPassword(email,newPassword);
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
        
              const result = await this.ownerService.resendOTP(email);
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
    const result = await this.ownerService.getProfileData(id);
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
      const result = await this.ownerService.updateProfile(id,formData);
    res.status(result.status).json({
      message:result.message,
    })
  } catch (error) {
    console.log(error);
    throw error;
  }
}


// async listFeatures(req:Request, res:Response):Promise<void>{
//   try {
//     const result = await ownerService.listFeatures();
//     console.log(result,"from owner controller");
//     res.status(result.status).json({
//       features: result.features,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
//       error: error instanceof Error ? error.message : "Failed to fetch features",
//     });
//   }
// }

// async ownerProperties(req:Request,res:Response):Promise<void>{
// try {
//   const ownerId = (req as any).userId; 

// const result = await ownerService.ownerProperties(ownerId);
//     res.status(result.status).json({
//       properties: result.properties,
//     });
// } catch (error) {
//   console.error(error);
//     res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
//       error: error instanceof Error ? error.message : "Failed to fetch properties",
//     });
// }
// }

async getOwnerStatus(req: Request, res: Response): Promise<any> {
  try {
    const result = await this.ownerService.getOwnerStatus(req.params.id);

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

async fetchWalletData(req:Request,res:Response):Promise<void>{
  try {
    const id= req.params.id;
    if(!id  ){
        res.status(STATUS_CODES.BAD_REQUEST).json({
          error: "user not found",
        });
        return;
      }
      const result = await this.ownerService.fetchWalletData(id);
      console.log(result)
    res.status(result.status).json({
      message:result.message,
      data:result.data,
      
    })
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async getPropertyById(req:Request,res:Response):Promise<void>{
  try {
    // const ownerId = (req as any).userId; 

    const id=req.params.id;
    console.log(id);
    const result = await this.ownerService.getPropertyById(id);
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

 async updateProperty(req:Request,res:Response):Promise<void>{
  try {
    const id= req.params.id;
  const data = req.body;
  console.log(id,"data to update", data);
  const result = await this.propertyService.updateProperty(id,data);
  res.status(result.status).json({
    message:result.message,
  })
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error instanceof Error ? error.message : "Failed to update property",
    });
  }
 }

 async refreshToken(req: Request, res: Response):Promise<void>{
  try {
    const token = req.cookies.refreshToken;
    if (!token) 
       res.status(401).json({ message: "Refresh token missing" });

    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string);
    const ownerId = (payload as any).ownerId;

    const newAccessToken = generateAccessToken({ ownerId, type: "owner" });

    res.cookie("auth-token", newAccessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: false, // true in production
      maxAge: 15 * 60 * 1000,
    });

    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
}

async getDashboardData(req: Request, res: Response): Promise<void> {
  try {
  const ownerId = (req as any).userId; 
    if (!ownerId) {
       res.status(400).json({ error: 'Owner ID is missing' });
    }
    const result = await this.ownerService.getDashboardData(ownerId);
console.log(result,"for dashborad")
    res.status(result.status).json({
      data: result.data,
      message: result.message,
    });
  } catch (error) {
    console.error('Error in getDashboardData controller:', error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error instanceof Error ? error.message : 'Failed to fetch dashboard data',
    });
  }
}



}

const generateAccessToken = (user: { ownerId: string; type: string }) => {
  const payload = {
    ownerId: user.ownerId,  
    type: user.type,
  };

  const secretKey = process.env.JWT_SECRET_KEY as string;

  const expiresIn = '15m';  

  return jwt.sign(payload, secretKey, { expiresIn });

  
};


export default OwnerController;









































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