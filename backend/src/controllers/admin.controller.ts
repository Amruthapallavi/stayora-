import { Request, Response } from "express";
import adminService from "../services/admin.service";
import IAdminController  from "./interfaces/IAdminController";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import jwt from "jsonwebtoken";
import { features } from "process";


class AdminController implements IAdminController {
    async login(req: Request, res: Response): Promise<void> {
        try {
          const { email, password } = req.body;
          const result = await adminService.loginAdmin(email, password);
          res.cookie("auth-token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600000,
            path: "/",
          });
          res.status(result.status).json({
            message: result.message})
    }catch (error) {
        console.error(error);
        res.status(STATUS_CODES.UNAUTHORIZED).json({
          error: error instanceof Error ? error.message : "Login Failed",
        });
      }
}
async refreshToken(req: Request, res: Response): Promise<void> {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log("refresh token")
    if (!refreshToken) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({ success: false, message: MESSAGES.ERROR.REFRESH_TOKEN_MISSING });
      return;
    }
    const result = await adminService.refreshToken(refreshToken);

    const accessTokenCookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 1 * 60 * 60 * 1000, // 1 hour
    };

    res
      .cookie('token', result.token, accessTokenCookieOptions)
      .status(STATUS_CODES.OK)
      .json({
        success: true,
        message: result.message,
        token: result.token,
      });
  } catch (error) {
    console.error("Refresh Token Error:", error);
    res.status(STATUS_CODES.UNAUTHORIZED).json({
      success: false,
      message: MESSAGES.ERROR.REFRESH_TOKEN_INVALID,
    });
  }
}
async getDashboardData(req: Request, res: Response): Promise<void> {
  try {
  
    const result = await adminService.getDashboardData();
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

async listAllUsers(req:Request, res:Response):Promise<void>{
  try {
    const result = await adminService.listAllUsers();
    res.status(result.status).json({
      users: result.users,
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error instanceof Error ? error.message : "Failed to fetch users",
    });
  }
}

async listAllOwners(req:Request, res:Response):Promise<void>{
  try {
    const result = await adminService.listAllOwners();
    res.status(result.status).json({
      owners: result.owners,
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error instanceof Error ? error.message : "Failed to fetch owners",
    });
  }
}

async updateUserStatus(req:Request,res:Response):Promise<void>{
  try {
    const id = req.params.id;
  const status= req.body.status;
  const result = await adminService.updateUserStatus(id,status)

  res.status(result.status).json({
    message: result.message,
  });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    error: error instanceof Error ? error.message : "Failed to update users",
    });
  }
}

async updateOwnerStatus(req:Request,res:Response):Promise<void>{
  try {
    const id = req.params.id;
  const status= req.body.status;
  const result = await adminService.updateOwnerStatus(id,status)
  console.log("ID:", req.params.id);
  
  res.status(result.status).json({
    message: result.message,
  });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    error: error instanceof Error ? error.message : "Failed to update users",
    });
  }
}
async updateFeature(req:Request,res:Response):Promise<void>{
  try {
    const id = req.params.id;
  const updatedData= req.body.data;
  const result = await adminService.updateFeature(id,updatedData)
  console.log("ID:", req.params.id);
  
  res.status(result.status).json({
    message: result.message,
  });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    error: error instanceof Error ? error.message : "Failed to update feature",
    });
  }
}


 


async updateServiceStatus(req:Request,res:Response):Promise<void>{
  const id = req.params.id;
  const status= req.body.status;
  console.log(req.body);
  const result = await adminService.updateServiceStatus(id,status)

  res.status(result.status).json({
    message: result.message,
  });
}

async listFeatures(req:Request, res:Response):Promise<void>{
  try {
    const result = await adminService.listFeatures();
    console.log(result,"from admin controller");
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

async addFeature(req:Request,res:Response): Promise<void>{
try {
  const featureData = req.body;
  const result = await adminService.addFeature(featureData);
  res.status(result.status).json({
    message: result.message,
  }); 
 } catch (error) {
  console.log(error)
}
}

async deleteOwner(req:Request,res:Response): Promise<void>{
  try {
    const id = req.params.id;
    const result = await adminService.deleteOwner(id);
    res.status(result.status).json({
      message: result.message,
    }); 
  } catch (error) {
    
  }
}
async listAllBookings(req:Request, res:Response):Promise<void>{
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 6;
    const result = await adminService.listAllBookings(page,limit);
    
    res.status(result.status).json({
      bookings: result.bookings,
      totalPages: result.totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error instanceof Error ? error.message : "Failed to fetch bookings",
    });
  }
}


async approveOwner(req:Request,res:Response): Promise<void>{
  try {
    const id = req.params.id;
    const result = await adminService.approveOwner(id);
    res.status(result.status).json({
      message: result.message,
    }); 
  } catch (error) {
    
  }
}
async rejectOwner(req:Request,res:Response): Promise<void>{
  try {
    const id = req.params.id;
    const {reason}=req.body;
    const result = await adminService.rejectOwner(id,reason);
    res.status(result.status).json({
      message: result.message,
    }); 
  } catch (error) {
    
  }
}

async removeFeature(req:Request,res:Response): Promise<void>{
  try {
    const id = req.params.id;
    const result = await adminService.removeFeature(id);
    res.status(result.status).json({
      message: result.message,
    }); 
  } catch (error) {
    
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

 async approveProperty(req: Request, res: Response) :Promise<void> {
  try {
    const propertyId = req.params.id;
    await adminService.approveProperty(propertyId);
    res.status(200).json({ message: 'Property approved successfully' });
  } catch (error) {
    console.error('Error approving property:', error);
    res.status(500).json({ message: 'Failed to approve property' });
  }
}

 async blockUnblockProperty(req: Request, res: Response):Promise<void> {
  try {
    const propertyId = req.params.id;
    const { status } = req.body;
    await adminService.blockUnblockProperty(propertyId, status);
    res.status(200).json({ message: `Property status updated to ${status}` });
  } catch (error) {
    console.error('Error updating property status:', error);
    res.status(500).json({ message: 'Failed to update status' });
  }
}

async deleteProperty(req: Request, res: Response):Promise<void> {
  try {
    const propertyId = req.params.id;
    await adminService.deleteProperty(propertyId);
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ message: 'Failed to delete property' });
  }
}
async rejectProperty(req:Request,res:Response): Promise<void>{
  try {
    const id = req.params.id;
    const {reason}=req.body;
    const result = await adminService.rejectProperty(id,reason);
    res.status(result.status).json({
      message: result.message,
    }); 
  } catch (error) {
    
  }
}
 async bookingDetails(req:Request,res:Response):Promise<void>{
      try {
        const bookingId=req.params.id;
        console.log("from controller")
        const result = await adminService.bookingDetails(bookingId);
        res.status(result.status).json({
          bookingData: result.bookingData,
          userData:result.userData,
          ownerData:result.ownerData,
        });
      } catch (error) {
        console.error(error);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          error: error instanceof Error ? error.message : "Failed to fetch booking data",
        });
      }
    }
     async getPropertyById(req:Request,res:Response):Promise<void>{
      try {
        const id=req.params.id;
        console.log(id);
        const result = await adminService.getPropertyById(id);
        res.status(result.status).json({
          Property: result.property,
          booking:result.booking,
          ownerData:result.ownerData,
        });
      } catch (error) {
        console.error(error);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          error: error instanceof Error ? error.message : "Failed to fetch property",
        });
      }
     }





}

export default new AdminController();