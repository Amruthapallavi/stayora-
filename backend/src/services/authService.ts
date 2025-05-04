

// class authService implements IAuthService{
//      async refreshToken(
//         refreshToken: string
//       ): Promise<{ success: boolean; token: string; message: string }> {
//         const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
//         const jwtSecret = process.env.JWT_SECRET;
//         if (!jwtSecret || !jwtRefreshSecret) {
//           throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
//         }
//         try {
//           const decoded = jwt.verify(refreshToken, jwtRefreshSecret) as {
//             adminId: string;
//             type: string;
//           };
//           const newAccessToken = jwt.sign(
//             { adminId: decoded.adminId, type: "admin" },
//             jwtSecret,
//             { expiresIn: "1h" }
//           );
    
//           return {
//             success: true,
//             token: newAccessToken,
//             message: "Access token refreshed successfully",
//           };
//         } catch (error) {
//           throw new Error("Invalid refresh token");
//         }
//       }
// }