import { Router } from 'express';
import authController from '../controllers/authController';
import passport from "../config/passport";
import container from "../config/DI/inversify";
import TYPES from "../config/DI/types";
import  UserController  from "../controllers/user.controller";

const authRouter = Router();

const userCtr = container.get<UserController>(TYPES.UserController );


authRouter.get("/refresh-token",authController.refreshToken)
authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

authRouter.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL}/user/login`
  }),
  userCtr.googleCallback.bind(userCtr)
);

export default authRouter;
