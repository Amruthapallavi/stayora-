import { Request, Response } from "express";

export default interface IAuthController {
    refreshToken(req: Request, res: Response): Promise<void>;

}