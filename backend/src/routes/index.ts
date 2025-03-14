import { Router } from "express";
// import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import ownerRoutes from "./owner.routes";
import adminRoutes from "./admin.routes";

const router = Router();

router.use("/user", userRoutes);
router.use("/owner", ownerRoutes);
router.use("/admin", adminRoutes);

export default router;