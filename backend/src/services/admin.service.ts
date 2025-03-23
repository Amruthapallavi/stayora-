import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import adminRepository from "../repositories/admin.repository";
import { IUser } from "../models/user.model";
import { IAdminService } from "./interfaces/IAdminService";
import { IOwner } from "../models/owner.model";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import userRepository from "../repositories/user.repository";
import ownerRepository from "../repositories/owner.repository";
import { isValidEmail } from "../utils/validators";
import Service from "../models/service.model";
import Feature from "../models/features.model";


interface ServiceData {
  name: string;
  description: string;
  price: number;
  image:string;
  contactMail:string;
  contactNumber:string;
  duration: string;
}

interface FeatureData {
  name: string;
  description: string;
  icon: string;
  
}
class AdminService implements IAdminService {
  private sanitizeAdmin(admin: IUser) {
    const { password, __v, ...sanitizedAdmin } = admin.toObject();
    return sanitizedAdmin;
  }

  async loginAdmin(
    email: string,
    password: string
  ): Promise<{
    admin: IUser;
    token: string;
    message: string;
    status: number;
  }> {
    if (!isValidEmail(email)) {
      throw new Error("Invalid email format");
    }
    if (!password) {
      throw new Error("Password is required");
    }

    const admin = await adminRepository.findByEmail(email);
    if (!admin || admin.role !== "admin") {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }

    const isPasswordValid = admin.password
  ? await bcrypt.compare(password, admin.password)
  : false;

if (!isPasswordValid) {
  throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
}


    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
    }

    const token = jwt.sign({ userId: admin._id, type: "admin" }, jwtSecret, {
      expiresIn: "1h",
    });

    return {
      admin: this.sanitizeAdmin(admin),
      token,
      message: MESSAGES.SUCCESS.LOGIN,
      status: STATUS_CODES.OK,
    };
  }

  // async getAdminDashboardStats(): Promise<{
  //   totalUsers: number;
  //   totalVendors: number;
  //   status: number;
  // }> {
  //   // const totalUsers = await userRepository.countDocuments({});
  //   // const totalVendors = await ownerRepository.countDocuments({});

  //   return {
  //     // totalUsers,
  //     // totalVendors,
  //     status: STATUS_CODES.OK,
  //   };
  // }

  async listAllUsers(): Promise<{ users: any[]; status: number }> {
    try {
      const users = await adminRepository.findAllUsers();
    console.log(users)
    return {
      users,
      status: STATUS_CODES.OK,
    };
    } catch (error) {
      console.error("Error in listServices:", error);
      return { 
        users: [], 
        status: STATUS_CODES.INTERNAL_SERVER_ERROR 
      };
    }
  }

  async listAllOwners(): Promise<{ owners: any[]; status: number }> {
    try {
      const owners = await adminRepository.findAllOwners();
    return {
      owners,
      status: STATUS_CODES.OK,
    };
    } catch (error) {
      console.error("Error in listServices:", error);
      return { 
        owners: [], 
        status: STATUS_CODES.INTERNAL_SERVER_ERROR 
      };
    }
  }

  async updateUserStatus(id: string, status: string): Promise<{ message: string; status: number }> {
    try {
      const user = await adminRepository.findUser(id);
    if (!user) {
      return {
        message: "user not found",
        status: STATUS_CODES.NOT_FOUND, 
      };
    }
      user.status = user.status === "Active" ? "Blocked" : "Active";
  
    
    
    await user.save();
  
    return {
      message: "Successful",
      status: STATUS_CODES.OK, // Ensure STATUS_CODES.OK is defined
    };
    } catch (error) {
      console.error("Error in update User:", error);
      return { message: MESSAGES.ERROR.SERVER_ERROR, status: STATUS_CODES.INTERNAL_SERVER_ERROR };
    }
  }

  async addService(serviceData: ServiceData): Promise<{ message: string; status: number }> {
    try {
      let { name, description,image, price, contactMail,contactNumber } = serviceData;
console.log(image,"image");
      // Trim values to remove unnecessary spaces
      // name = name.trim();
      // description = description.trim();
      // duration = duration.trim();

      // Validate required fields
      if (!name || !description || !price || !contactMail || !contactNumber) {
        return { message: MESSAGES.ERROR.INVALID_INPUT, status: STATUS_CODES.BAD_REQUEST };
      }

      // Validate price (must be a positive number)
      if (price <= 0 || isNaN(price)) {
        return { message: "Enter a valid price.", status: STATUS_CODES.BAD_REQUEST };
      }

      const existingService = await Service.findOne({ name });
      if (existingService) {
        return { message: "Service already exists.", status: STATUS_CODES.CONFLICT };
      }

      // Create and save the service
      const newService = new Service({ name, description, price, contactMail,contactNumber });
      await newService.save();
        // await adminRepository.create({
        //     ...serviceData,
            
        //     });
      // Create and save the service
      // const newService = new ServiceModel({ name, description, price, duration });
      // await newService.save();

      return { message: "Service added successfully!", status: STATUS_CODES.CREATED };
    } catch (error) {
      console.error("Error in add Service:", error);
      return { message: MESSAGES.ERROR.SERVER_ERROR, status: STATUS_CODES.INTERNAL_SERVER_ERROR };
    }
  }

  async listServices(): Promise<{ services: any[]; status: number; message: string }> {
    try {
      const services = await adminRepository.findServices();
  
      console.log("Fetched Services:", services); // Debugging log
      return {
        services,
        status: STATUS_CODES.OK,
        message: "successfully fetched", 
      };
    } catch (error) {
      console.error("Error in listServices:", error);
      return { 
        services: [], 
        message: MESSAGES.ERROR.SERVER_ERROR, 
        status: STATUS_CODES.INTERNAL_SERVER_ERROR 
      };
    }
  }
  
  async updateServiceStatus(id: string, status: string): Promise<{ message: string; status: number }> {
   try {
     // Find the service
     const service = await adminRepository.findService(id);
  
     // Check if service exists
     if (!service) {
       return {
         message: "Service not found",
         status: STATUS_CODES.NOT_FOUND, // Ensure STATUS_CODES.NOT_FOUND is defined
       };
     }
   
     // Toggle status
     service.status = service.status === "active" ? "disabled" : "active";
   
     
     
     await service.save();
   
     return {
       message: "Successful",
       status: STATUS_CODES.OK, // Ensure STATUS_CODES.OK is defined
     };
   } catch (error) {
    
   
    console.error("Error in addService:", error);
    return { message: MESSAGES.ERROR.SERVER_ERROR, status: STATUS_CODES.INTERNAL_SERVER_ERROR };
  }
}
  
  async listFeatures(): Promise<{ features: any[]; status: number; message:string }> {
    try {
      const features = await adminRepository.findFeatures();

    console.log(features)
    return {
      features,
      status: STATUS_CODES.OK,
      message:"successfully fetched"
    };
    } catch (error) {
      console.error("Error in listServices:", error);
      return { 
        features: [], 
        message: MESSAGES.ERROR.SERVER_ERROR, 
        status: STATUS_CODES.INTERNAL_SERVER_ERROR 
    }
  }

  }

  async addFeature(featureData: FeatureData): Promise<{ message: string; status: number }> {
    try {
      let { name, description,icon } = featureData;
      console.log(icon,"icon");
      

      // Validate required fields
      if (!name || !description ) {
        return { message: MESSAGES.ERROR.INVALID_INPUT, status: STATUS_CODES.BAD_REQUEST };
      }

      

      const existingFeature = await Feature.findOne({ name });
      if (existingFeature) {
        return { message: "Service already exists.", status: STATUS_CODES.CONFLICT };
      }

      // Create and save the service
      const newFeature = new Feature({ name, description, icon });
      await newFeature.save();
      return { message: "Feature added successfully!", status: STATUS_CODES.CREATED };
    } catch (error) {
      console.error("Error in addService:", error);
      return { message: MESSAGES.ERROR.SERVER_ERROR, status: STATUS_CODES.INTERNAL_SERVER_ERROR };
    }
  }

  async updateOwnerStatus(id: string, status: string): Promise<{ message: string; status: number }> {
    try {
      const owner = await adminRepository.findOwner(id);
    if (!owner) {
      return {
        message: "owner not found",
        status: STATUS_CODES.NOT_FOUND, 
      };
    }
      owner.status = owner.status === "Active" ? "Blocked" : "Active";
  
    
    
    await owner.save();
  
    return {
      message: "Successful",
      status: STATUS_CODES.OK, 
    };
    } catch (error) {
      console.error("Error in update User:", error);
      return { message: MESSAGES.ERROR.SERVER_ERROR, status: STATUS_CODES.INTERNAL_SERVER_ERROR };
    }
  }

  async deleteOwner(id: string): Promise<{ message: string; status: number }> {
    try {
      const owner = await adminRepository.findOwner(id);
      if (!owner) {
        return {
          message: "owner not found",
          status: STATUS_CODES.NOT_FOUND, 
        };
      }
      const result=await adminRepository.deleteOwner( id);
      
      console.log(result)
      return {
        message: "Successfully deleted",
        status: STATUS_CODES.OK,
      };
    } catch (error) {
      console.error("Error in deleteOwner:", error);
      return { 
        message: MESSAGES.ERROR.SERVER_ERROR, 
        status: STATUS_CODES.INTERNAL_SERVER_ERROR 
      };
    }
  }
  
 async approveOwner(id: string): Promise<{ message: string; status: number }> {
  try {
    const owner = await adminRepository.findOwner(id);
    if (!owner) {
      return {
        message: "owner not found",
        status: STATUS_CODES.NOT_FOUND, 
      };
    }
    
    if(owner.status==="Active"){
      return {
        message: "owner already verified",
        status: STATUS_CODES.NOT_FOUND, 
      };
    }
    owner.status="Active";
    await owner.save();

    return {
      message: " Approved Successfully ",
      status: STATUS_CODES.OK,
    };
  } catch (error) {
    console.error("Error in approving owner:", error);
    return { 
      message: MESSAGES.ERROR.SERVER_ERROR, 
      status: STATUS_CODES.INTERNAL_SERVER_ERROR 
    };
  }
}

async rejectOwner(id: string,reason:string): Promise<{ message: string; status: number }> {
  try {
    const owner = await adminRepository.findOwner(id);
    if (!owner) {
      return {
        message: "owner not found",
        status: STATUS_CODES.NOT_FOUND, 
      };
    }
    const rejectedOwner = await ownerRepository.update(id, {
      govtIdStatus: "rejected",
      rejectionReason:reason,
    });
   

    return {
      message: " Approved Successfully ",
      status: STATUS_CODES.OK,
    };
  } catch (error) {
    console.error("Error in approving owner:", error);
    return { 
      message: MESSAGES.ERROR.SERVER_ERROR, 
      status: STATUS_CODES.INTERNAL_SERVER_ERROR 
    };
  }
}
async removeFeature(id: string): Promise<{ message: string; status: number }> {
  try {
    const feature = await adminRepository.findFeature(id);
    if (!feature) {
      return {
        message: "bo feature found",
        status: STATUS_CODES.NOT_FOUND, 
      };
    }
    const result=await adminRepository.deleteFeature( id);
    
    console.log(result)
    return {
      message: "Successfully deleted",
      status: STATUS_CODES.OK,
    };
  } catch (error) {
    console.error("Error in remove feature:", error);
    return { 
      message: MESSAGES.ERROR.SERVER_ERROR, 
      status: STATUS_CODES.INTERNAL_SERVER_ERROR 
    };
  }
}
}
export default new AdminService();
