
import { Request, Response } from "express";

export default interface IAdminController {
  login(req: Request, res: Response): Promise<void>;
  addService(req: Request, res: Response): Promise<void>;
//   logout(req: Request, res: Response): Promise<void>;

}



























// getAdminDashboardStats(req: Request, res: Response): Promise<void>;
// listUsers(req: Request, res: Response): Promise<void>;
// listAllVendors(req: Request, res: Response): Promise<void>;
// listPendingVendors(req: Request, res: Response): Promise<void>;