import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import adminRepository from "../repositories/admin.repository";
import { IUser } from "../models/user.model";
import { IAdminService } from "./interfaces/IAdminService";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import userRepository from "../repositories/user.repository";
import ownerRepository from "../repositories/owner.repository";
import { isValidEmail } from "../utils/validators";

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

  async listUsers(): Promise<{ users: any[]; status: number }> {
    const users = await userRepository.find({});
    console.log(users)
    return {
      users,
      status: STATUS_CODES.OK,
    };
  }

  // async listallOwners(): Promise<{ owners: any[]; status: number }> {
  //   const vendors = await ownerRepository.find({});
  //   return {
  //     owners,
  //     status: STATUS_CODES.OK,
  //   };
  // }

  // async listPendingOwners(): Promise<{ vendors: any[]; status: number }> {
  //   const vendors = await ownerRepository.find({ status: "pending" });
  //   return {
  //     vendors,
  //     status: STATUS_CODES.OK,
  //   };
  // }

//   async listAllAdmins(): Promise<{ admins: any[]; status: number }> {
//     const admins = await userRepository.find({ role: "admin" });
//     return {
//       admins,
//       status: STATUS_CODES.OK,
//     };
//   }
}
  

export default new AdminService();
