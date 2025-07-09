import { Request, Response } from "express";
import { IOwnerController } from "./interfaces/IOwnerController";
import { STATUS_CODES } from "../utils/constants";
import jwt from "jsonwebtoken";
import { inject, injectable } from "inversify";
import  TYPES  from "../config/DI/types";
import IOwnerService from "../services/interfaces/IOwnerService";
import { IPropertyService } from "../services/interfaces/IPropertyService";
// import { VerifyPaymentDTO } from "../DTO/booking/bookingControllerDTO";

// interface MulterRequest extends Request {
//   file?: Express.Multer.File;
// }

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
      const result = await this.ownerService.verifyOTP(email, otp);
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
        const result = await this.ownerService.loginOwner(email, password,res);
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
            id: result.owner.id,
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
      
          if (!email) {
            res.status(STATUS_CODES.BAD_REQUEST).json({
              error: "Email is required",
            });
            return;
          }
      
          const result = await this.ownerService.resendOTP(email);
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
    const result = await this.ownerService.getProfileData(id);
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
      const result = await this.ownerService.updateProfile(id,formData);
    res.status(result.status).json({
      message:result.message,
    })
  } catch (error) {
    console.log(error);
    throw error;
  }
}
 async subscription(req:Request,res:Response):Promise<void>{
  try {
    const {planName,price,allowedProperties}=req.body;
    const ownerId=(req as any).userId;
    if (!price || typeof price !== "number") {
           res.status(400).json({ message: "Invalid price amount" });
        }
    const order = await this.ownerService.subscription(price,planName,ownerId,allowedProperties);
        res.status(200).json(order);
  } catch (error) {
     console.error("Error in subscription controller:", error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong while subscribing.",
    });
  }
 }

async verifySubscription(req: Request, res: Response): Promise<void> {
  try {
    const ownerId = (req as any).userId;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      planName,
      price,
      allowedProperties,
    } = req.body.paymentData;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400).json({ message: "Missing payment verification fields" });
      return;
    }

    const result = await this.ownerService.verifySubscription({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      ownerId,
      planName,
      price,
      allowedProperties
    });

    if (!result.isValid) {
      res.status(400).json({ success: false, message: "Payment verification failed" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Error verifying subscription payment:", error);
    if (!res.headersSent) {
      res.status(500).json({
        message: error instanceof Error ? error.message : "Payment verification failed",
      });
    }
  }
}

async changePassword  (req: Request, res: Response): Promise<void> {
  try {
    const userId = req.params.id;
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Both old and new passwords are required." });
      return;
    }

    const result = await this.ownerService.changePassword(userId, oldPassword, newPassword);

    res.status(result.status).json({ message: result.message });
  } catch (error) {
    console.error("Error in changePassword controller:", error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      message: "Something went wrong while changing the password.",
    });
  }
}

async getOwnerStatus(req: Request, res: Response): Promise<void> {
  try {
    const result = await this.ownerService.getOwnerStatus(req.params.id);

    if (!result.user) {
       res.status(result.status).json({ message: result.message });
    }
    res.status(result.status).json({
      status: result.user?.status,
      user: result.user?.id,
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

    const id=req.params.id;
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
      secure: true, 
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







































