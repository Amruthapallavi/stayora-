import { Request, Response } from "express";
// import adminService from "../services/admin.service";
// import IAdminController  from "./interfaces/IAdminController";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import jwt from "jsonwebtoken";
import { features } from "process";
import { injectable,inject } from "inversify";
import TYPES from "../config/DI/types";
// import AdminService from "../services/admin.service";
import { IAdminService } from "../services/interfaces/IAdminService";
import IAdminController from "./interfaces/IAdminController";

@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject(TYPES.AdminService)
      private adminService: IAdminService
    
  ){}

    async login(req: Request, res: Response): Promise<void> {
        try {
          const { email, password } = req.body;
          const result = await this.adminService.loginAdmin(email, password);
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
    const result = await this.adminService.refreshToken(refreshToken);

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
  
    const result = await this.adminService.getDashboardData();
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
    const result = await this.adminService.listAllUsers();
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
    const result = await this.adminService.listAllOwners();
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
  const result = await this.adminService.updateUserStatus(id,status)

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
  const result = await this.adminService.updateOwnerStatus(id,status)
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



 


async deleteOwner(req:Request,res:Response): Promise<void>{
  try {
    const id = req.params.id;
    const result = await this.adminService.deleteOwner(id);
    res.status(result.status).json({
      message: result.message,
    }); 
  } catch (error) {
    
  }
}




async approveOwner(req:Request,res:Response): Promise<void>{
  try {
    const id = req.params.id;
    const result = await this.adminService.approveOwner(id);
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
    const result = await this.adminService.rejectOwner(id,reason);
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






}

export default  AdminController;