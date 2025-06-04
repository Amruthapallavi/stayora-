import { Router } from 'express';
import authController from '../controllers/authController';

const authRouter = Router();



authRouter.get("/refresh-token",authController.refreshToken)

export default authRouter;
