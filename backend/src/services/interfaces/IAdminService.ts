import { IUser } from "../../models/user.model";

export interface IAdminService {
  loginAdmin(
    email: string,
    password: string
  ): Promise<{ admin: IUser; token: string; message: string; status: number }>;
  listAllUsers(
    users:any[]
  ):Promise<void>
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
