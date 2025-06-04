import { Router } from "express";
// import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import ownerRoutes from "./owner.routes";
import adminRoutes from "./admin.routes";
import authRouter from "./auth.route";

const router = Router();

router.use("/user", userRoutes);
router.use("/owner", ownerRoutes);
router.use("/admin", adminRoutes);
router.use("/auth",authRouter);
export default router;