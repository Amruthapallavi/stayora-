import { IUser } from "../../models/user.model";
import { IService } from "../../models/service.model";
import { IOwner } from "../../models/owner.model";
import { DashboardData } from "../../type/admin";
import { UserResponseDTO } from "../../DTO/UserResponseDto";
import { OwnerResponseDTO } from "../../DTO/OwnerResponseDTO";
import { DashboardResponseDTO } from "../../DTO/DashboardDataDTO";
export interface IAdminService {
  loginAdmin(email: string, password: string): Promise<{message: string;token: string;refreshToken: string;admin: Partial<IUser>; status:number }>;
  refreshToken(refreshToken: string): Promise<{ token: string; message: string }>;

  
  listAllUsers( page: number,
  limit: number,searchTerm:string): Promise<{ users: UserResponseDTO[]; status: number ;totalPages:number,currentPage:number,totalUsers:UserResponseDTO[] }>;
  listAllOwners( page: number,
  limit: number,searchTerm:string): Promise<{ owners: OwnerResponseDTO[]; status: number;totalPages:number,currentPage:number,totalOwners:OwnerResponseDTO[]  }>;

  updateUserStatus(id: string, status: string): Promise<{ message: string; status: number }>;

  updateOwnerStatus(id: string, status: string): Promise<{ message: string; status: number }>;
getDashboardData(): Promise<DashboardResponseDTO>;
  deleteOwner(id: string): Promise<{ message: string; status: number }>;

approveOwner(id: string): Promise<{ message: string; status: number }>;

rejectOwner(id: string, reason: string): Promise<{ message: string; status: number }>;

}






























