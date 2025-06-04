export enum PaymentStatus {
  Pending = "pending",
  Completed = "completed",
  Failed = "failed",
  Refunded = "refunded",
}

export enum BookingStatus {
  Pending = "pending",
  Confirmed = "confirmed",
  Cancelled = "cancelled",
  Completed = "completed",
}


export enum UserStatus {
    Pending="Pending",
    Active="Active",
    Blocked="Blocked"
}

export enum GovtIdStatus {
    Approved="approved",
    Rejected ="rejected",
    Pending="pending",
}
export enum PaymentType {
  Credit = "credit",
  Debit = "debit",
}
export enum Role {
    User="user",
    Admin="admin"
}
export enum SubscriptionPlan{
  GOLD="GOLD",
  SILVER="SILVER",
  PLATINUM="PLATINUM",
  BASIC="BASIC"
}
export enum ServiceStatus {
    Active ="active",
    Disabled="disabled",
}

export enum PropertyStatus {
  Pending = "pending",
  Active = "active",
  Blocked = "blocked",
  Booked = "booked",
  Rejected = "rejected"
}

export enum FurnishingStatus{
    Fully_Furnished ="Fully-furnished",
    Semi_Furnished="Semi-Furnished",
    Not_Furnished="Not-Furnished"
}