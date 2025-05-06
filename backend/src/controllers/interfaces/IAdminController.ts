
import { Request, Response } from "express";

export default interface IAdminController {
  login(req: Request, res: Response): Promise<void>;
  refreshToken(req: Request, res: Response): Promise<void>;
  getDashboardData(req: Request, res: Response): Promise<void>;
  listAllUsers(req: Request, res: Response): Promise<void>;
  listAllOwners(req: Request, res: Response): Promise<void>;
  updateUserStatus(req: Request, res: Response): Promise<void>;
  updateOwnerStatus(req: Request, res: Response): Promise<void>;
  deleteOwner(req: Request, res: Response): Promise<void>;
  approveOwner(req: Request, res: Response): Promise<void>;
  rejectOwner(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;


}



























// getAdminDashboardStats(req: Request, res: Response): Promise<void>;
// listUsers(req: Request, res: Response): Promise<void>;
// listAllVendors(req: Request, res: Response): Promise<void>;
// listPendingVendors(req: Request, res: Response): Promise<void>;