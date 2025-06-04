export interface IUser {
    id: string;
    name: string;
    email: string;
    phone: string;
    createdAt?:Date,
    address?: {
      houseNo?: string;
      street?: string;
      city?: string;
      district?: string;
      state?: string;
      pincode?: string;
    };
    status:"Active"|"Blocked";
    
    isVerified:boolean;
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
  

  export interface IUserResponse {
    users: IUser[] ;
    totalPages?:number;
    currentPage?:number;
    totalUsers?:IUser[];
  }
  
 