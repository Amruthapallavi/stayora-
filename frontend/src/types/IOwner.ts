export interface IOwner {
    _id: string;
    name: string;
    email: string;
    phone: string;
    password?: string;
    govtId: string;
    role?:"owner";
    govtIdStatus?: "pending" | "approved" | "rejected";
    rejectionReason?: string | null;
    address: Address;
    houses?: string | null; // ref to house ID
    status?: "Pending" | "Blocked" | "Active";
    isVerified: boolean;
    otp?: string | null;
    otpExpires?: string | null; // ISO string from backend
    createdAt: string;
    updatedAt: string;
  }
  
  interface Address {
    houseNo: string;
    street: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
  }




  // Define a form-specific type
export interface ProfileFormType {
  name: string;
  email: string;
  phone: string;
  address: {
    houseNo: string;
    street: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
  };
}
