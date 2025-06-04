// inversify.config.ts
import "reflect-metadata";
import { Container } from "inversify";
import TYPES from "./types";


// //controller
import  UserController from "../../controllers/user.controller";
import { IUserController } from "../../controllers/interfaces/IUserController";
import BookingController from "../../controllers/booking.controller";
import { IBookingController } from "../../controllers/interfaces/IBookingController";
import AdminController from "../../controllers/admin.controller";
import IAdminController from "../../controllers/interfaces/IAdminController";
import ChatController from "../../controllers/chat.controller";
import { IChatController } from "../../controllers/interfaces/IChatController";
import PropertyController from "../../controllers/property.controller";
import { IPropertyController } from "../../controllers/interfaces/IPropertyController";
import FeatureController from "../../controllers/feature.controller";
import { IFeatureController } from "../../controllers/interfaces/IFeatureController";
import NotificationController from "../../controllers/notification.controller";
import { INotificationController } from "../../controllers/interfaces/INotificationController";
import OwnerController from "../../controllers/owner.controller";
import { IOwnerController } from "../../controllers/interfaces/IOwnerController";
import ServiceController from "../../controllers/service.controller";
import IServiceController from "../../controllers/interfaces/IServiceController";

// //services
import { IUserService } from "../../services/interfaces/IUserService";
import  UserService from "../../services/user.service";
import {OwnerService} from "../../services/owner.service";
import  IOwnerService  from "../../services/interfaces/IOwnerService";
import AdminService from "../../services/admin.service";
import { IAdminService } from "../../services/interfaces/IAdminService";
import BookingService from "../../services/bookingService";
import { IBookingService } from "../../services/interfaces/IBookingService";
import ChatService from "../../services/chat.service";
import { IChatService } from "../../services/interfaces/IChatService";
import FeatureService from "../../services/featureService";
import IFeatureService from "../../services/interfaces/IFeatureService";
import ServiceService from "../../services/service.service";
import { IServiceService } from "../../services/interfaces/IServiceService";
import PropertyService from "../../services/property.service";
import { IPropertyService } from "../../services/interfaces/IPropertyService";
import NotificationService from "../../services/notification.service";
import { INotificationService } from "../../services/interfaces/INotificationServices";


// //repository
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import  UserRepository  from "../../repositories/user.repository";
import OwnerRepository from "../../repositories/owner.repository";
import { IOwnerRepository } from "../../repositories/interfaces/IOwnerRepository";
import AdminRepository from "../../repositories/admin.repository";
import { IAdminRepository } from "../../repositories/interfaces/IAdminRepository";
import PropertyRepository from "../../repositories/property.repository";
import { IPropertyRepository } from "../../repositories/interfaces/IPropertyRepository";
import FeatureRepository from "../../repositories/feature.repository";
import { IFeatureRepository } from "../../repositories/interfaces/IFeatureRepository";
import ServiceRepository from "../../repositories/serviceRepository";
import { IServiceRepository } from "../../repositories/interfaces/IServiceRepository";
import BookingRepository from "../../repositories/booking.repository";
import { IBookingRepository } from "../../repositories/interfaces/IBookingRepository";
import MessageRepository from "../../repositories/message.repository";
import { IMessageReposiotry } from "../../repositories/interfaces/IMessageRepository";
import NotificationRepository from "../../repositories/notification.repository";
import { INotificationRepository } from "../../repositories/interfaces/INotificationRepository";
import { IWalletRepository } from "../../repositories/interfaces/IWalletRepository";
import walletRepository from "../../repositories/wallet.repository";
import { IReviewRepository } from "../../repositories/interfaces/IReviewRepository";
import ReviewRepository from "../../repositories/reviewRepository";
// import userService from "../../services/user.service";

const container = new Container();

container.bind<IAdminController>(TYPES.AdminController).to(AdminController);
container.bind<IBookingController>(TYPES.BookingController).to(BookingController);
container.bind<IUserController>(TYPES.UserController).to(UserController);
container.bind<IOwnerController>(TYPES.OwnerController).to(OwnerController);
container.bind<IFeatureController>(TYPES.FeatureController).to(FeatureController);
container.bind<IServiceController>(TYPES.ServiceController).to(ServiceController);
container.bind<IPropertyController>(TYPES.PropertyController).to(PropertyController);
container.bind<INotificationController>(TYPES.NotificationController).to(NotificationController);
container.bind<IChatController>(TYPES.ChatController).to(ChatController);



// // Service bindings
container.bind<IUserService>(TYPES.UserService).to(UserService);
container.bind<IOwnerService>(TYPES.OwnerService).to(OwnerService);
container.bind<IAdminService>(TYPES.AdminService).to(AdminService);
container.bind<IBookingService>(TYPES.BookingService).to(BookingService);
container.bind<IChatService>(TYPES.ChatService).to(ChatService);
container.bind<IFeatureService>(TYPES.FeatureService).to(FeatureService);
container.bind<IServiceService>(TYPES.ServiceService).to(ServiceService);
container.bind<IPropertyService>(TYPES.PropertyService).to(PropertyService);
container.bind<INotificationService>(TYPES.NotificationService).to(NotificationService);
// // Bindings


container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);

container.bind<IOwnerRepository>(TYPES.OwnerRepository).to(OwnerRepository);
container.bind<IAdminRepository>(TYPES.AdminRepository).to(AdminRepository);
container.bind<IPropertyRepository>(TYPES.PropertyRepository).to(PropertyRepository);
container.bind<IFeatureRepository>(TYPES.FeatureRepository).to(FeatureRepository);
container.bind<IServiceRepository>(TYPES.ServiceRepository).to(ServiceRepository);
container.bind<IBookingRepository>(TYPES.BookingRepository).to(BookingRepository);
container.bind<IMessageReposiotry>(TYPES.MessageRepository).to(MessageRepository);
container.bind<INotificationRepository>(TYPES.NotificationRepository).to(NotificationRepository);
container.bind<IWalletRepository>(TYPES.WalletRepository).to(walletRepository);
container.bind<IReviewRepository>(TYPES.ReviewRepository).to(ReviewRepository);



export default container;
