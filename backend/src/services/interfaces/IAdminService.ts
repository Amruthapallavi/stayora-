import { IUser } from "../../models/user.model";
import { IService } from "../../models/service.model";
import { IOwner } from "../../models/owner.model";
import { DashboardData } from "../../type/admin";
export interface IAdminService {
  loginAdmin(email: string, password: string): Promise<{message: string;token: string;refreshToken: string;admin: Partial<IUser>; status:number }>;
  refreshToken(refreshToken: string): Promise<{ token: string; message: string }>;

  
  listAllUsers(): Promise<{ users: IUser[]; status: number }>;
  listAllOwners(): Promise<{ owners: IOwner[]; status: number }>;

  updateUserStatus(id: string, status: string): Promise<{ message: string; status: number }>;

  updateOwnerStatus(id: string, status: string): Promise<{ message: string; status: number }>;
  getDashboardData(): Promise<{ data: DashboardData | null; status: number; message: string }>;
  deleteOwner(id: string): Promise<{ message: string; status: number }>;

approveOwner(id: string): Promise<{ message: string; status: number }>;

rejectOwner(id: string, reason: string): Promise<{ message: string; status: number }>;

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
