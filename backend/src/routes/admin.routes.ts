import { Router } from "express";
import container from "../config/DI/inversify";

import TYPES from "../config/DI/types";

import AdminController from "../controllers/admin.controller";
import { uploadServiceImage } from "../middlewares/multer";
import { authMiddleware } from "../middlewares/auth.middleware";
import ServiceController from "../controllers/service.controller";
import PropertyController from "../controllers/property.controller";
import FeatureController from "../controllers/feature.controller";
import BookingController from "../controllers/booking.controller";

const adminRoutes = Router();

const adminCtr = container.get<AdminController>(TYPES.AdminController);
const propertyCtr = container.get<PropertyController>(TYPES.PropertyController);
const serviceCtr = container.get<ServiceController>(TYPES.ServiceController);
const featureCtr = container.get<FeatureController>(TYPES.FeatureController);
const bookingCtr = container.get<BookingController>(TYPES.BookingController);

adminRoutes.post("/login", adminCtr.login.bind(adminCtr));

adminRoutes.get(
  "/users",
  authMiddleware(["admin"]),
  adminCtr.listAllUsers.bind(adminCtr)
);
adminRoutes.get(
  "/owners",
  authMiddleware(["admin"]),
  adminCtr.listAllOwners.bind(adminCtr)
);

adminRoutes.post(
  "/add-service",
  authMiddleware(["admin"]),
  uploadServiceImage.single("serviceImage"),
  serviceCtr.createService.bind(serviceCtr)
);
adminRoutes.get(
  "/services",
  authMiddleware(["admin"]),
  serviceCtr.listServices.bind(serviceCtr)
);
adminRoutes.get(
  "/all-Properties",
  authMiddleware(["admin"]),
  propertyCtr.getAllProperties.bind(propertyCtr)
);
adminRoutes.post("/refresh-token", adminCtr.refreshToken.bind(adminCtr));
adminRoutes.get(
  "/dashboard",
  authMiddleware(["admin"]),
  adminCtr.getDashboardData.bind(adminCtr)
);

adminRoutes.patch(
  "/services/status/:id",
  authMiddleware(["admin"]),
  serviceCtr.updateServiceStatus.bind(serviceCtr)
);
adminRoutes.get(
  "/features",
  authMiddleware(["admin"]),
  featureCtr.listFeatures.bind(featureCtr)
);
adminRoutes.post(
  "/add-feature",
  authMiddleware(["admin"]),
  featureCtr.addFeature.bind(featureCtr)
);
adminRoutes.patch(
  "/owners/status/:id",
  authMiddleware(["admin"]),
  adminCtr.updateOwnerStatus.bind(adminCtr)
);
// adminRoutes.post("/owners/status/",authMiddleware(["admin"]),adminController.addFeature);
// adminRoutes.post("/add-feature",authMiddleware(["admin"]),adminController.addFeature);
adminRoutes.patch(
  "/owners/approve/:id",
  authMiddleware(["admin"]),
  adminCtr.approveOwner.bind(adminCtr)
);
adminRoutes.patch(
  "/owners/reject/:id",
  authMiddleware(["admin"]),
  adminCtr.rejectOwner.bind(adminCtr)
);
adminRoutes.patch(
  "/features/:id",
  authMiddleware(["admin"]),
  featureCtr.updateFeature.bind(featureCtr)
);
adminRoutes.patch(
  "/users/status/:id",
  authMiddleware(["admin"]),
  adminCtr.updateUserStatus.bind(adminCtr)
);
adminRoutes.post(
  "/owners/delete/:id",
  authMiddleware(["admin"]),
  adminCtr.deleteOwner.bind(adminCtr)
);
adminRoutes.post(
  "/features/delete/:id",
  authMiddleware(["admin"]),
  featureCtr.removeFeature.bind(featureCtr)
);
adminRoutes.patch(
  "/properties/reject/:id",
  authMiddleware(["admin"]),
  propertyCtr.rejectProperty.bind(propertyCtr)
);
adminRoutes.get(
  "/property/:id",
  authMiddleware(["admin"]),
  propertyCtr.getPropertyById.bind(propertyCtr)
);

adminRoutes.patch(
  "/properties/approve/:id",
  authMiddleware(["admin"]),
  propertyCtr.approveProperty.bind(propertyCtr)
);
adminRoutes.patch(
  "/properties/status/:id",
  authMiddleware(["admin"]),
  propertyCtr.blockUnblockProperty.bind(propertyCtr)
);
adminRoutes.delete(
  "/properties/:id",
  authMiddleware(["admin"]),
  propertyCtr.deleteProperty.bind(propertyCtr)
);
adminRoutes.get(
  "/bookings",
  authMiddleware(["admin"]),
  bookingCtr.listAllBookings.bind(bookingCtr)
);
adminRoutes.get(
  "/bookings/:id",
  authMiddleware(["admin"]),
  bookingCtr.AllbookingDetails.bind(bookingCtr)
);

adminRoutes.post("/logout", adminCtr.logout);

export default adminRoutes;
