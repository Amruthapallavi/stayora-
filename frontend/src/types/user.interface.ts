export interface IUser {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    createdAt?:Date,
    address?: {
      houseNo?: string;
      street?: string;
      city?: string;
      district?: string;
      state?: string;
      pincode?: string;
    };
  }
  