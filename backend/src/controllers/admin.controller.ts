import { Request, Response } from "express";
import adminService from "../services/admin.service";
import IAdminController  from "./interfaces/IAdminController";
import { STATUS_CODES } from "../utils/constants";
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
async addService(req:Request, res:Response):Promise<void>{
  try {
    const serviceData= req.body;
    const serviceImage = req.file?.path;
    const result = await adminService.addService(serviceData);
    res.status(result.status).json({
      message: result.message,
    }); 
   } catch (error) {
    console.log(error)
  }
}

 
async listServices(req:Request, res:Response):Promise<void>{
  try {
    const result = await adminService.listServices();
    res.status(result.status).json({
      services: result.services,
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error instanceof Error ? error.message : "Failed to fetch services",
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

}

export default new AdminController();