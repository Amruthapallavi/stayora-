import { Request, Response } from "express";

export interface IUserController {
  register(req: Request, res: Response): Promise<void>;
  login(req: Request, res: Response): Promise<void>;
  verifyOTP(req: Request, res: Response): Promise<void>;
  resendOTP(req: Request, res: Response): Promise<void>;
  forgotPassword(req:Request,res:Response): Promise <void>;
  resetPassword(req:Request,res:Response):Promise <void>;
  googleCallback(req: Request, res: Response): Promise<void>;
  // updateUserProfile(req: Request, res: Response): Promise<void>;
  listServices(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
  cancelBooking(req: Request, res: Response): Promise<void>;
  updateProfile(req: Request, res: Response): Promise<void>;
  getUserBookings(req: Request, res: Response): Promise<void>;
  saveAddOnServices(req: Request, res: Response): Promise<void>;
  getUserStatus(req: Request, res: Response): Promise<void>;

}

