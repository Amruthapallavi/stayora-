import { Request, Response } from "express";

export interface IBookingController {
  createBooking(req: Request, res: Response): Promise<void>;
  verifyPayment(req: Request, res: Response): Promise<void>;
  listBookingsByOwner(req: Request, res: Response): Promise<void>;
  bookingDetails(req: Request, res: Response): Promise<void>;
  userBookingDetails(req: Request, res: Response): Promise<void>;
  listAllBookings(req: Request, res: Response): Promise<void>;
  AllbookingDetails(req: Request, res: Response): Promise<void>;
}
