import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { MESSAGES, STATUS_CODES } from "../utils/constants";


export const authMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies["auth-token"];
    console.log(token, "from middleware");

    if (!token) {
      res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ message: MESSAGES.ERROR.UNAUTHORIZED });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        userId?: string;
        ownerId?: string;
        adminId?: string;
        type: string;
      };

      console.log(decoded, "decoded");

      if (!allowedRoles.includes(decoded.type)) {
        res
          .status(STATUS_CODES.FORBIDDEN)
          .json({ message: MESSAGES.ERROR.FORBIDDEN });
        return;
      }

      // Assign correct ID based on type
      if (decoded.type === "owner") {
        (req as any).userId = decoded.ownerId; // Assign ownerId
      } else if (decoded.type === "user") {
        (req as any).userId = decoded.userId; // Assign userId
      } else if (decoded.type === "admin") {
        (req as any).userId = decoded.adminId; // Assign adminId
      }

      (req as any).userType = decoded.type;

      next();
    } catch (error) {
      res
        .status(STATUS_CODES.UNAUTHORIZED)
        .json({ message: MESSAGES.ERROR.INVALID_TOKEN });
      return;
    }
  };
};
