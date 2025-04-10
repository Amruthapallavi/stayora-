import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import adminRepository from "../repositories/admin.repository";
import { IUser } from "../models/user.model";
import { IAdminService } from "./interfaces/IAdminService";
import { IOwner } from "../models/owner.model";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import userRepository from "../repositories/user.repository";
import ownerRepository from "../repositories/owner.repository";
import Mail from "../utils/Mail";
import { isValidEmail } from "../utils/validators";
import Service from "../models/service.model";
import Feature from "../models/features.model";
import { IProperty } from "../models/property.model";
import { IBooking } from "../models/booking.model";


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
      status: STATUS_CODES.OK, 
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

      if (price <= 0 || isNaN(price)) {
        return { message: "Enter a valid price.", status: STATUS_CODES.BAD_REQUEST };
      }

      const existingService = await Service.findOne({ name });
      if (existingService) {
        return { message: MESSAGES.ERROR.SERVICE_ALREADY_EXISTS, status: STATUS_CODES.CONFLICT };
      }

      const newService = new Service({ name, description, price, contactMail,contactNumber,image });
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
  
      console.log("Fetched Services:", services); 
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
     const service = await adminRepository.findService(id);
  
     if (!service) {
       return {
         message: "Service not found",
         status: STATUS_CODES.NOT_FOUND, 
       };
     }
   
     service.status = service.status === "active" ? "disabled" : "active";
   
     
     
     await service.save();
   
     return {
       message: "Successful",
       status: STATUS_CODES.OK, 
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
      

      if (!name || !description ) {
        return { message: MESSAGES.ERROR.INVALID_INPUT, status: STATUS_CODES.BAD_REQUEST };
      }

      

      const existingFeature = await Feature.findOne({ name });
      if (existingFeature) {
        return { message: "Feature already exists.", status: STATUS_CODES.CONFLICT };
      }

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
  
  async updateFeature(
    id: string,
    updatedData: Record<string, any>
  ): Promise<{ message: string; status: number }> {
    try {
      const feature = await adminRepository.findFeature(id);
      if (!feature) {
        return {
          message: "Feature not found",
          status: STATUS_CODES.NOT_FOUND,
        };
      }
  
      Object.assign(feature, updatedData);
  
      await feature.save();
  
      return {
        message: "Update successful",
        status: STATUS_CODES.OK,
      };
    } catch (error) {
      console.error("Error in updateFeature:", error);
      return {
        message: MESSAGES.ERROR.SERVER_ERROR,
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      };
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
    
    if(owner.govtIdStatus==="approved"){
      return {
        message: "owner already approved",
        status: STATUS_CODES.NOT_FOUND, 
      };
    }
    owner.govtIdStatus="approved";
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


async rejectOwner(id: string, reason: string): Promise<{ message: string; status: number }> {
  try {
    const owner = await adminRepository.findOwner(id);
    if (!owner) {
      return {
        message: "Owner not found",
        status: STATUS_CODES.NOT_FOUND,
      };
    }

    await ownerRepository.update(id, {
      govtIdStatus: "rejected",
      rejectionReason: reason,
    });

    await Mail.sendRejectionMail(owner.email, reason);

    return {
      message: "Rejected successfully & email sent",
      status: STATUS_CODES.OK,
    };
  } catch (error) {
    console.error("Error rejecting owner:", error);
    return {
      message: "Internal Server Error",
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
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
async getAllProperties(): Promise<{ properties: IProperty[]; status: number; message: string }> {
    try {
      const properties = await adminRepository.findProperties();
  
      return {
        properties: properties || [], 
        status: STATUS_CODES.OK,
        message: "Successfully fetched",
      };
    } catch (error) {
      console.error("Error in property listing:", error);
      return {
        properties: [], 
        message: MESSAGES.ERROR.SERVER_ERROR,
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async approveProperty(id: string): Promise<{ status: number; message: string }> {
    try {
      await adminRepository.approveProperty(id);
  
      return {
        status: STATUS_CODES.OK,
        message: "Property approved successfully",
      };
    } catch (error) {
      console.error("Error approving property:", error);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: MESSAGES.ERROR.SERVER_ERROR,
      };
    }
  }
  async blockUnblockProperty(id: string, status: string): Promise<{ status: number; message: string }> {
    try {
      await adminRepository.blockUnblockProperty(id, status);
  
      return {
        status: STATUS_CODES.OK,
        message: `Property status updated to ${status}`,
      };
    } catch (error) {
      console.error("Error updating property status:", error);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: MESSAGES.ERROR.SERVER_ERROR,
      };
    }
  }
  async deleteProperty(id: string): Promise<{ status: number; message: string }> {
    try {
      await adminRepository.deleteProperty(id);
  
      return {
        status: STATUS_CODES.OK,
        message: "Property deleted successfully",
      };
    } catch (error) {
      console.error("Error deleting property:", error);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: MESSAGES.ERROR.SERVER_ERROR,
      };
    }
  }
  async listAllBookings(): Promise<{ bookings: IBooking[]; status: number; message: string }> {
    try {
      const bookings = await adminRepository.findAllBookings();
  
      return {
        bookings: bookings || [], 
        status: STATUS_CODES.OK,
        message: "Successfully fetched",
      };
    } catch (error) {
      console.error("Error in property listing:", error);
      return {
        bookings: [], 
        message: MESSAGES.ERROR.SERVER_ERROR,
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      };
    }
  }
      


}
export default new AdminService();
