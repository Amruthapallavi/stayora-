import { IUser } from "../../models/user.model";
import { IService } from "../../models/service.model";
export interface IAdminService {
  loginAdmin(
    email: string,
    password: string
  ): Promise<{ admin: IUser; token: string; message: string; status: number }>;
  
  listAllUsers(): Promise<{ users: any[]; status: number }>;
  listServices(): Promise<{ services: any[]; status: number }>;
  addService(serviceData:Partial<IService>):Promise <{message:string}>;
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
