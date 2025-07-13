import { Request, Response } from "express";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { injectable,inject } from "inversify";
import TYPES from "../config/DI/types";
import { IAdminService } from "../services/interfaces/IAdminService";
import IAdminController from "./interfaces/IAdminController";
import { LoginRequestDTO } from "../DTO/LoginReqDTO";
import { PaginationQueryDTO, RejectOwnerDTO, UpdateStatusDTO } from "../DTO/PaginationDTO";

@injectable()
export class AdminController implements IAdminController {
  constructor(
    @inject(TYPES.AdminService)
      private _adminService: IAdminService
    
  ){}

    async login(req: Request, res: Response): Promise<void> {
        try {
          const { email, password } :LoginRequestDTO= req.body;
          const result = await this._adminService.loginAdmin(email, password);
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
    if (!refreshToken) {
      res.status(STATUS_CODES.UNAUTHORIZED).json({ success: false, message: MESSAGES.ERROR.REFRESH_TOKEN_MISSING });
      return;
    }
    const result = await this._adminService.refreshToken(refreshToken);

    const accessTokenCookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 1 * 60 * 60 * 1000, 
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
  
    const result = await this._adminService.getDashboardData();
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

async listAllUsers(req: Request, res: Response): Promise<void> {
  try {
   const { page, limit, search }: PaginationQueryDTO = {
  page: parseInt(req.query.page as string) || 1,
  limit: parseInt(req.query.limit as string) || 10,
  search: typeof req.query.search === 'string' ? req.query.search : '',
};
    const result = await this._adminService.listAllUsers(page, limit,search);

    res.status(result.status).json({
      users: result.users,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      totalUsers: result.totalUsers,
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
    const { page, limit, search }: PaginationQueryDTO = {
  page: parseInt(req.query.page as string) || 1,
  limit: parseInt(req.query.limit as string) || 10,
  search: typeof req.query.search === 'string' ? req.query.search : '',
};
    const result = await this._adminService.listAllOwners(page, limit,search);

    res.status(result.status).json({
      owners: result.owners,
      totalPages: result.totalPages,
      currentPage: result.currentPage,
      totalOwners: result.totalOwners,
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
    const userId = req.params.id;
const { status }: UpdateStatusDTO = req.body.status;
  const result = await this._adminService.updateUserStatus(userId,status)

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
    const ownerId = req.params.id;
const { status }: UpdateStatusDTO = req.body.status;
  const result = await this._adminService.updateOwnerStatus(ownerId,status)
  
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
    const ownerId = req.params.id;
    const result = await this._adminService.deleteOwner(ownerId);
    res.status(result.status).json({
      message: result.message,
    }); 
  } catch (error) {
    
  }
}


async approveOwner(req:Request,res:Response): Promise<void>{
  try {
    const ownerId = req.params.id;
    const result = await this._adminService.approveOwner(ownerId);
    res.status(result.status).json({
      message: result.message,
    }); 
  } catch (error) {
    
  }
}
async rejectOwner(req:Request,res:Response): Promise<void>{
  try {
    const ownerId = req.params.id;
const reason: string = req.body.reason;
    const result = await this._adminService.rejectOwner(ownerId,reason);
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