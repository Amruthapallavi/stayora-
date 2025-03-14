import { Request, Response } from "express";
import userService from "../services/user.service";

import IAdminController  from "./interfaces/IAdminController";
import { STATUS_CODES } from "../utils/constants";
import jwt from "jsonwebtoken";


class AdminController implements IAdminController {
    async login(req: Request, res: Response): Promise<void> {
        try {
          const { email, password } = req.body;
          const result = await userService.loginUser(email, password);
          res.cookie("auth-token", result.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 3600000,
            path: "/",
          });
          res.status(result.status).json({
            message: result.message})
    }catch (error) {
        console.error(error);
        res.status(STATUS_CODES.UNAUTHORIZED).json({
          error: error instanceof Error ? error.message : "Login Failed",
        });
      }
}


}

export default new AdminController();