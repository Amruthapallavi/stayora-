import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import IAuthController from './interfaces/IAuthController';

class AuthController implements IAuthController {
  async refreshToken(req: Request, res: Response): Promise<void> {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401).json({ message: 'No refresh token' });
      return;
    }

    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as jwt.JwtPayload;

      const newAccessToken = jwt.sign(
        { userId: payload.userId, type: payload.type },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      res.status(200).json({ token: newAccessToken });
    } catch (error) {
      res.status(403).json({ message: 'Invalid or expired refresh token' });
    }
  }
}

export default new AuthController();
