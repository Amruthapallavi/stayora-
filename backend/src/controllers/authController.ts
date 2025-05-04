// import { Request, Response } from "express";
// import { MESSAGES, STATUS_CODES } from "../utils/constants";
// import IAuthController from "./interfaces/IAuthController";


// class authController implements IAuthController{

//     async refreshToken(req: Request, res: Response): Promise<void> {
//       try {
//         const refreshToken = req.cookies.refreshToken;
//         console.log("refresh token")
//         if (!refreshToken) {
//           res.status(STATUS_CODES.UNAUTHORIZED).json({ success: false, message: MESSAGES.ERROR.REFRESH_TOKEN_MISSING });
//           return;
//         }
//         const result = await authService.refreshToken(refreshToken);
    
//         const accessTokenCookieOptions = {
//           httpOnly: true,
//           secure: process.env.NODE_ENV === 'production',
//           sameSite: 'strict' as const,
//           maxAge: 1 * 60 * 60 * 1000, // 1 hour
//         };
    
//         res
//           .cookie('token', result.token, accessTokenCookieOptions)
//           .status(STATUS_CODES.OK)
//           .json({
//             success: true,
//             message: result.message,
//             token: result.token,
//           });
//       } catch (error) {
//         console.error("Refresh Token Error:", error);
//         res.status(STATUS_CODES.UNAUTHORIZED).json({
//           success: false,
//           message: MESSAGES.ERROR.REFRESH_TOKEN_INVALID,
//         });
//       }
//     }
// }