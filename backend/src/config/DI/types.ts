const TYPES = {
    // Controllers
    UserController: Symbol.for("UserController"),
    BookingController: Symbol.for("BookingController"),
    AdminController:  Symbol.for("AdminController"),
    PropertyController: Symbol.for("PropertyController"),
    FeatureController: Symbol.for("FeatureController"),
    NotificationController: Symbol.for("NotificationController"),
    OwnerController: Symbol.for("OwnerController"),
    ServiceController: Symbol.for("ServiceController"),
    ChatController: Symbol.for("ChatController"),
  
    // Services
    UserService: Symbol.for("UserService"),
    OwnerService: Symbol.for("OwnerService"),
    AdminService: Symbol.for("AdminService"),
    BookingService: Symbol.for("BookingService"),
    ChatService: Symbol.for("ChatService"),
    FeatureService: Symbol.for("FeatureService"),
    ServiceService: Symbol.for("ServiceService"),
    PropertyService: Symbol.for("PropertyService"),
    NotificationService: Symbol.for("NotificationService"),
  
    // Repositories
    UserRepository: Symbol.for("UserRepository"),
    OwnerRepository: Symbol.for("OwnerRepository"),
    AdminRepository: Symbol.for("AdminRepository"),
    PropertyRepository: Symbol.for("PropertyRepository"),
    FeatureRepository: Symbol.for("FeatureRepository"),
    ServiceRepository: Symbol.for("ServiceRepository"),
    BookingRepository: Symbol.for("BookingRepository"),
    MessageRepository: Symbol.for("MessageRepository"),
    WalletRepository: Symbol.for("WalletRepository"),
    ReviewRepository:Symbol.for("ReviewRepository"),
    NotificationRepository: Symbol.for("NotificationRepository"),
  };
  
  export default TYPES;
  