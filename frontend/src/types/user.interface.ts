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


 export interface Message {
    _id: string;
    content: string;
    sender: string | { _id: string };
    senderModel: string;
    receiver: string;
    propertyId?: string;
    receiverModel: string;
    images?: string[];
    createdAt: string;
  }
  