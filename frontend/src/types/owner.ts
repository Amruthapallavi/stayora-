export interface IOwner {
    id: string;
    name: string;
    email: string;
    phone: string;
    password?: string;
    govtId: string;
    role?:"owner";
    govtIdStatus?: "pending" | "approved" | "rejected";
    rejectionReason?: string | null;
    address: Address;
    houses?: string | null;
    status: "Pending" | "Blocked" | "Active";
    isVerified: boolean;
    otp?: string | null;
    otpExpires?: string | null; 
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


export interface OwnersResponse {
  owners: IOwner[];
  totalOwners?:IOwner[];
  totalPages?:number;
    currentPage?:number
}