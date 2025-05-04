
import { Request, Response } from "express";

export default interface IAdminController {
  login(req: Request, res: Response): Promise<void>;
  // addService(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
listAllUsers(req: Request, res: Response): Promise<void>;
listAllOwners(req: Request, res: Response): Promise<void>;
updateUserStatus(req: Request, res: Response): Promise<void>;
updateOwnerStatus(req: Request, res: Response): Promise<void>;
updateFeature(req: Request, res: Response): Promise<void>;
updateServiceStatus(req: Request, res: Response): Promise<void>;
listFeatures(req: Request, res: Response): Promise<void>;
deleteOwner(req: Request, res: Response): Promise<void>;
removeFeature(req: Request, res: Response): Promise<void>;
approveProperty(req: Request, res: Response): Promise<void>;
blockUnblockProperty(req: Request, res: Response): Promise<void>;
deleteProperty(req: Request, res: Response): Promise<void>;
bookingDetails(req: Request, res: Response): Promise<void>;
rejectProperty(req: Request, res: Response): Promise<void>;

}



























// getAdminDashboardStats(req: Request, res: Response): Promise<void>;
// listUsers(req: Request, res: Response): Promise<void>;
// listAllVendors(req: Request, res: Response): Promise<void>;
// listPendingVendors(req: Request, res: Response): Promise<void>;