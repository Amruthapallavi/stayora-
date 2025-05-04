import { IUser } from "../../models/user.model";
import { IService } from "../../models/service.model";
export interface IAdminService {
  loginAdmin(email: string, password: string): Promise<{message: string;token: string;refreshToken: string;admin: Partial<IUser>; }>;
  refreshToken(refreshToken: string): Promise<{ token: string; message: string }>;

  
  listAllUsers(): Promise<{ users: any[]; status: number }>;
}
































// getAdminDashboardStats(): Promise<{
//     totalUsers: number;
//     totalVendors: number;
//     status: number;
//   }>;

//   listUsers(): Promise<{ users: any[]; status: number }>;

//   listAllVendors(): Promise<{ vendors: any[]; status: number }>;

//   listPendingVendors(): Promise<{ vendors: any[]; status: number }>;

//   listAllAdmins(): Promise<{ admins: any[]; status: number }>;
// }
