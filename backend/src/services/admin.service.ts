import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser } from "../models/user.model";
import { IAdminService } from "./interfaces/IAdminService";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import Mail from "../utils/Mail";
import { isValidEmail } from "../utils/validators";
import { inject, injectable } from "inversify";
import  TYPES  from "../config/DI/types";
import { IAdminRepository } from "../repositories/interfaces/IAdminRepository";
import { IPropertyRepository } from "../repositories/interfaces/IPropertyRepository";
import { IBookingRepository } from "../repositories/interfaces/IBookingRepository";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { IOwnerRepository } from "../repositories/interfaces/IOwnerRepository";
import { GovtIdStatus, Role, UserStatus } from "../models/status/status";
import { UserResponseDTO } from "../DTO/UserResponseDto";
import { mapUsersToDTOs } from "../mappers/userMapper";
import { OwnerResponseDTO } from "../DTO/OwnerResponseDTO";
import { mapOwnersToDTOs, mapOwnerToDTO } from "../mappers/ownerMapper";
import { DashboardResponseDTO } from "../DTO/DashboardDataDTO";


@injectable()
export class AdminService implements IAdminService {
  constructor(
    @inject(TYPES.AdminRepository)
      private adminRepository: IAdminRepository,
      @inject(TYPES.PropertyRepository)
      private propertyRepository: IPropertyRepository,
      @inject(TYPES.BookingRepository)
      private bookingRepository: IBookingRepository,
      @inject(TYPES.UserRepository)
      private userRepository: IUserRepository,
      @inject(TYPES.OwnerRepository)
      private ownerRepository: IOwnerRepository
    
  ){}

   
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

    const admin = await this.adminRepository.findByEmail(email);
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
    await this.adminRepository.updateRefreshToken(admin._id.toString(), refreshToken);

    return {
      admin:{
        id:admin._id,
        name:admin.name,
        email:admin.email,
        role:Role.Admin,
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
 
async listAllUsers(
  page: number,
  limit: number,
  searchTerm: string
): Promise<{
  users: UserResponseDTO[];
  status: number;
  totalUsers: UserResponseDTO[];
  totalPages: number;
  currentPage: number;
}> {
  try {
    const { users, totalUser, totalPages } =
      await this.adminRepository.findAllUsers(page, limit, searchTerm);
    const totalUsers=  await this.userRepository.find({role:"user"});
    const userDTOs = mapUsersToDTOs(users);
    const totalUsersDTOs=mapUsersToDTOs(totalUsers);
    return {
      users: userDTOs,
      totalUsers:totalUsersDTOs,
      totalPages,
      currentPage: page,
      status: STATUS_CODES.OK,
    };
  } catch (error) {
    console.error("Error in listAllUsers:", error);
    return {
      users: [],
      totalUsers: [],
      totalPages: 0,
      currentPage: page,
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
  }
}


  async listAllOwners( page: number,
  limit: number,
  searchTerm: string
): Promise<{
  owners: OwnerResponseDTO[];
  status: number;
  totalOwners: OwnerResponseDTO[];
  totalPages: number;
  currentPage: number;}> {
    try {
     const { owners, totalOwner, totalPages } =
      await this.adminRepository.findAllOwners(page, limit, searchTerm);
  const totalOwners=await this.ownerRepository.find();
    const ownerDTOs = mapOwnersToDTOs(owners);
    const totalOwnerDTOs=mapOwnersToDTOs(totalOwners);
    return {
      owners: ownerDTOs,
      totalOwners:totalOwnerDTOs,
      totalPages,
      currentPage: page,
      status: STATUS_CODES.OK,
    };
    } catch (error) {
    console.error("Error in listAllUsers:", error);
    return {
      owners: [],
      totalOwners: [],
      totalPages: 0,
      currentPage: page,
      status: STATUS_CODES.INTERNAL_SERVER_ERROR,
    };
  }
}
  async updateUserStatus(id: string, status: string): Promise<{ message: string; status: number }> {
    try {
      const user = await this.adminRepository.findUser(id);
    if (!user) {
      return {
        message: "user not found",
        status: STATUS_CODES.NOT_FOUND, 
      };
    }
      user.status = user.status === UserStatus.Active ? UserStatus.Blocked : UserStatus.Active;
  
    
    
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


async getDashboardData(): Promise<DashboardResponseDTO> {
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
        this.adminRepository.getUserRegistrations(),
        this.adminRepository.getOwnerRegistrations(),
        this.adminRepository.getBookingStats(),
        this.propertyRepository.find(), 
        this.bookingRepository.find(),    
        this.userRepository.find(),
        this.ownerRepository.find(),
      ]);
      const totalUsers = allUsers.filter(p => p.role === "user").length;
      const activeUsers=allUsers.filter(p => p.status === "Active").length;
      const blockedUsers=allUsers.filter(p => p.status === "Blocked").length;
      const verifiedUsers=allUsers.filter(p => p.isVerified ===true&&p.role !="admin").length;

            const totalOwners = ownerStats.reduce((sum, o) => sum + o.count, 0);
            const activeOwner=allOwners.filter(p => p.status === "Active").length;
            const blockedOwners=allOwners.filter(p => p.status === "Blocked").length;

      const totalBookings = bookingStats.reduce((sum, b) => sum + b.count, 0);

      const totalRevenue = bookingStats.reduce((sum, b) => sum + b.revenue, 0);

      const totalProperties = allProperties.length;
      const activeProperties = allProperties.filter(p => p.status === "active").length;
      const pendingProperties = allProperties.filter(p => p.status === "pending").length;

      const bookedProperties = allProperties.filter(p => p.status === "booked").length;
      const rejectedProperties = allProperties.filter(p => p.status === "rejected").length;

      const activeBookings = allBookings.filter(b => b.bookingStatus === "confirmed").length;
      const completedBookings = allBookings.filter(b => b.bookingStatus === "completed").length;
      const cancelledBookings = allBookings.filter(b => b.bookingStatus === "cancelled").length;
      const totalBookingCount = allBookings.length;
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
     const subscriptionRevenue = await this.adminRepository.subscriptionRevenue();
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
        totalBookingCount,
        subscriptionRevenue,


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


  
 
 
  async updateOwnerStatus(id: string, status: string): Promise<{ message: string; status: number }> {
    try {
      const owner = await this.adminRepository.findOwner(id);
    if (!owner) {
      return {
        message: "owner not found",
        status: STATUS_CODES.NOT_FOUND, 
      };
    }
      owner.status = owner.status === UserStatus.Active ? UserStatus.Blocked : UserStatus.Active;
  
    
    
    await owner.save();
  
    return {
      message: MESSAGES.SUCCESS.STATUS_UPDATED,
      status: STATUS_CODES.OK, 
    };
    } catch (error) {
      console.error("Error in update User:", error);
      return { message: MESSAGES.ERROR.SERVER_ERROR, status: STATUS_CODES.INTERNAL_SERVER_ERROR };
    }
  }
  
 
  


  async deleteOwner(id: string): Promise<{ message: string; status: number }> {
    try {
      const owner = await this.adminRepository.findOwner(id);
      if (!owner) {
        return {
          message: "owner not found",
          status: STATUS_CODES.NOT_FOUND, 
        };
      }
      const result=await this.adminRepository.deleteOwner( id);
      
      return {
        message: MESSAGES.SUCCESS.DELETED_SUCCESSFUL,
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
    const owner = await this.adminRepository.findOwner(id);
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
    owner.govtIdStatus=GovtIdStatus.Approved;
    owner.status= UserStatus.Active;
    await owner.save();
    await Mail.sendApprovalMail(owner.email, owner.name);

    return {
      message:MESSAGES.SUCCESS.APPROVE_SUCCESSFUL,
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
    const owner = await this.adminRepository.findOwner(id);
    if (!owner) {
      return {
        message: "Owner not found",
        status: STATUS_CODES.NOT_FOUND,
      };
    }

    await this.ownerRepository.update(id, {
      govtIdStatus: GovtIdStatus.Rejected,
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








    
  
    

}
export default AdminService;















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