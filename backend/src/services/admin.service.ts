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
import  { Types } from "mongoose";

import Feature from "../models/features.model";
import { IProperty } from "../models/property.model";
import { IBooking } from "../models/booking.model";
import propertyRepository from "../repositories/property.repository";
import mongoose from "mongoose";
import bookingRepository from "../repositories/booking.repository";


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
    admin: Partial<IUser>;
    token: string;
    message: string;
    refreshToken:string;
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
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;

    if (!jwtSecret || !jwtRefreshSecret) {
      return {
        admin: this.sanitizeAdmin(admin),
        message:
        MESSAGES.ERROR.JWT_SECRET_MISSING || "JWT secret missing",
        status: STATUS_CODES.UNAUTHORIZED,

        token: "",
        refreshToken: "",
      };
    }
    if (!jwtSecret) {
      throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
    }

    const token = jwt.sign({ userId: admin._id, type: "admin" }, jwtSecret, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(
      { adminId: admin._id, type: "admin" },
      jwtRefreshSecret,
      { expiresIn: "7d" }
    );
    // const adminId=admin._id;
    await adminRepository.updateRefreshToken(admin._id.toString(), refreshToken);

    return {
      admin:{
        id:admin._id,
        name:admin.name,
        email:admin.email,
        role:"admin",
      },
      token,
      message: MESSAGES.SUCCESS.LOGIN,
      status: STATUS_CODES.OK,
      refreshToken:"",
    };
  }

  async refreshToken(
    refreshToken: string
  ): Promise<{ success: boolean; token: string; message: string }> {
    const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret || !jwtRefreshSecret) {
      throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
    }
    try {
      const decoded = jwt.verify(refreshToken, jwtRefreshSecret) as {
        adminId: string;
        type: string;
      };
      const newAccessToken = jwt.sign(
        { adminId: decoded.adminId, type: "admin" },
        jwtSecret,
        { expiresIn: "1h" }
      );

      return {
        success: true,
        token: newAccessToken,
        message: "Access token refreshed successfully",
      };
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
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


  async getDashboardData(): Promise<{ data: any; status: number; message: string }> {
    try {
      const [
        userStats,
        ownerStats,
        bookingStats,
        allProperties,
        allBookings,
        allUsers,
        allOwners,
      ] = await Promise.all([
        adminRepository.getUserRegistrations(),
        adminRepository.getOwnerRegistrations(),
        adminRepository.getBookingStats(),
        propertyRepository.find(), // fetch all properties
        bookingRepository.find(),    // fetch all bookings
        userRepository.find(),
        ownerRepository.find(),
      ]);
      console.log(userStats,"dta")
      const totalUsers = allUsers.filter(p => p.role === "user").length;
      const activeUsers=allUsers.filter(p => p.status === "Active").length;
      const blockedUsers=allUsers.filter(p => p.status === "Blocked").length;
      const verifiedUsers=allUsers.filter(p => p.isVerified ===true&&p.role !="admin").length;

            const totalOwners = ownerStats.reduce((sum, o) => sum + o.count, 0);
            const activeOwner=allOwners.filter(p => p.status === "Active").length;
            const blockedOwners=allOwners.filter(p => p.status === "Blocked").length;

      const totalBookings = bookingStats.reduce((sum, b) => sum + b.count, 0);

      const totalRevenue = bookingStats.reduce((sum, b) => sum + b.revenue, 0);

      // Property stats
      const totalProperties = allProperties.length;
      const activeProperties = allProperties.filter(p => p.status === "active").length;
      const pendingProperties = allProperties.filter(p => p.status === "pending").length;

      const bookedProperties = allProperties.filter(p => p.status === "booked").length;
      const rejectedProperties = allProperties.filter(p => p.status === "rejected").length;

      // Booking stats
      const activeBookings = allBookings.filter(b => b.bookingStatus === "confirmed").length;
      const completedBookings = allBookings.filter(b => b.bookingStatus === "completed").length;
      const cancelledBookings = allBookings.filter(b => b.bookingStatus === "cancelled").length;
      const totalBookingCount = allBookings.length;
      // Monthly analytics
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const resultMap = new Map<string, any>();

      const mapData = (data: any[], key: string) => {
        data.forEach(item => {
          const month = `${monthNames[item._id.month - 1]} ${item._id.year}`;
          if (!resultMap.has(month)) {
            resultMap.set(month, { month, users: 0, owners: 0, bookings: 0 });
          }
          resultMap.get(month)[key] = item.count ?? item.revenue;
        });
      };

      mapData(userStats, "users");
      mapData(ownerStats, "owners");
      mapData(bookingStats, "bookings");

      const userActivityData = Array.from(resultMap.values());
      const revenueData = bookingStats.map(item => ({
        month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
        revenue: item.revenue
      }));

      const dashboardData = {
        totalUsers,
        totalOwners,
        totalBookings,
        completedBookings,
        activeBookings,
        cancelledBookings,
        totalRevenue,
        totalProperties,
        activeProperties,
        bookedProperties,
        rejectedProperties,
        pendingProperties,
        userActivityData,
        revenueData,
        activeUsers,
        blockedUsers,
        verifiedUsers,
        activeOwner,
        blockedOwners,
        totalBookingCount

      };

      return {
        data: dashboardData,
        status: STATUS_CODES.OK,
        message: "Admin dashboard fetched successfully"
      };

    } catch (error) {
      console.error("Error in getDashboardData (Admin):", error);
      return {
        data: null,
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: MESSAGES.ERROR.SERVER_ERROR
      };
    }
  }

//   async addService(serviceData: ServiceData): Promise<{ message: string; status: number }> {
//     try {
//       let { name, description,image, price, contactMail,contactNumber } = serviceData;
// console.log(image,"image");
//       // Trim values to remove unnecessary spaces
//       // name = name.trim();
//       // description = description.trim();
//       // duration = duration.trim();

//       // Validate required fields
//       if (!name || !description || !price || !contactMail || !contactNumber) {
//         return { message: MESSAGES.ERROR.INVALID_INPUT, status: STATUS_CODES.BAD_REQUEST };
//       }

//       if (price <= 0 || isNaN(price)) {
//         return { message: "Enter a valid price.", status: STATUS_CODES.BAD_REQUEST };
//       }

//       const existingService = await Service.findOne({ name });
//       if (existingService) {
//         return { message: MESSAGES.ERROR.SERVICE_ALREADY_EXISTS, status: STATUS_CODES.CONFLICT };
//       }

//       const newService = new Service({ name, description, price, contactMail,contactNumber,image });
//       await newService.save(); 
//         // await adminRepository.create({
//         //     ...serviceData,
            
//         //     });
//       // Create and save the service
//       // const newService = new ServiceModel({ name, description, price, duration });
//       // await newService.save();

//       return { message: "Service added successfully!", status: STATUS_CODES.CREATED };
//     } catch (error) {
//       console.error("Error in add Service:", error);
//       return { message: MESSAGES.ERROR.SERVER_ERROR, status: STATUS_CODES.INTERNAL_SERVER_ERROR };
//     }
//   }

  // async listServices(): Promise<{ services: any[]; status: number; message: string }> {
  //   try {
  //     const services = await adminRepository.findServices();
  
  //     console.log("Fetched Services:", services); 
  //     return {
  //       services,
  //       status: STATUS_CODES.OK,
  //       message: "successfully fetched", 
  //     };
  //   } catch (error) {
  //     console.error("Error in listServices:", error);
  //     return { 
  //       services: [], 
  //       message: MESSAGES.ERROR.SERVER_ERROR, 
  //       status: STATUS_CODES.INTERNAL_SERVER_ERROR 
  //     };
  //   }
  // }
  
  
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
  async listAllBookings(  page: number = 1,
    limit: number = 5): Promise<{ bookings: IBooking[]; status: number; message: string;    totalPages: number;
    }> {
    try {
      const skip = (page - 1) * limit;

      const bookings = await adminRepository.findAllBookings(skip,limit);
      const totalBookings = await adminRepository.countAllBookings();
      const totalPages = Math.ceil(totalBookings / limit);
      return {
        bookings: bookings || [], 
        status: STATUS_CODES.OK,
        totalPages,
        message: "Successfully fetched",
      };
    } catch (error) {
      console.error("Error in property listing:", error);
      return {
        bookings: [], 
        totalPages:0,
        message: MESSAGES.ERROR.SERVER_ERROR,
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      };
    }
  }
    
  

async rejectProperty(id: string, reason: string): Promise<{ message: string; status: number }> {
  try {
    const property = await propertyRepository.findById(id);
    if (!property) {
      return {
        message: "property not found",
        status: STATUS_CODES.NOT_FOUND,
      };
    }

    const updatedData:Partial<IProperty>={
      isRejected:true,
      rejectedReason:reason,
      status:"rejected",
    }
    // const ownerId=new mongoose.Types.ObjectId(property.ownerId);
    // const owner=await ownerRepository.findById(ownerId);

    // await ownerRepository.update(id, {
    //   govtIdStatus: "rejected",
    //   rejectionReason: reason,
    // });


    // await Mail.sendRejectionMail(owner.email, reason);
        const response=  await propertyRepository.update(id, updatedData);
        console.log(response);

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

 async bookingDetails(id: string): Promise<{
      bookingData: IBooking | null;
      ownerData:IOwner |null;
      userData:IUser | null;
      status: number;
      message: string;
    }> {
      try {
        const bookingData = await bookingRepository.findBookingData(id);
        let userData: IUser | null = null;
        let ownerData:IOwner |null=null;
        if (bookingData?.userId) {
          userData = await userRepository.findById(bookingData.userId.toString());
          console.log('user:', userData);
        }
        console.log(bookingData?.ownerId,"ownerId")
        if (bookingData?.ownerId) {
          ownerData = await ownerRepository.findById(bookingData.ownerId.toString());
          console.log('Owner:', ownerData);
        }
            return {
          bookingData,
          userData,
          ownerData,
          status: STATUS_CODES.OK,
          message: "Successfully fetched",
        };
      } catch (error) {
        console.error("Error in bookingDetails:", error);
        return {
          bookingData: null,
          userData:null,
          ownerData:null,
          message: MESSAGES.ERROR.SERVER_ERROR,
          status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        };
      }
    }

    
      async getPropertyById(id: string): Promise<{ property: any; ownerData: any;booking:any; status: number; message: string }> {
        try {
          const property = await propertyRepository.findPropertyById(id) as IProperty;
    
          if (!property) {
            throw new Error("Property not available");
          }
          
          if (!property) {
            return {
              property: null,
              booking:null,
              ownerData: null,
              status: STATUS_CODES.NOT_FOUND,
              message: "Property not found"
            };
          }
      
          const ownerId = property.ownerId.toString(); 
          const owner = await userRepository.findOwnerById(ownerId);
      
          const ownerData = owner
          ? {
              name: owner.name,
              phone: owner.phone,
              email: owner.email
            }
          : null;
          const booking = await bookingRepository.findPropertyBookings(id);
          console.log(booking,"for admin pag")
          return {
            property,
            booking,
            ownerData,
            status: STATUS_CODES.OK,
            message: "Property fetched successfully"
          };
      
        } catch (error) {
          console.error("Error in getPropertyById:", error);
          return {
            property: null,
            ownerData: null,
            booking:null,
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
            message: MESSAGES.ERROR.SERVER_ERROR,
          };
        }
      }
    

}
export default new AdminService();
