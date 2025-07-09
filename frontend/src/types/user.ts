export interface IUser {
    id: string;
    name: string;
    email: string;
    phone: string;
createdAt: string | Date;
    address?: {
      houseNo?: string;
      street?: string;
      city?: string;
      district?: string;
      state?: string;
      pincode?: string;
    };
status: string;
    
    isVerified:boolean;
  }

export interface ISignUpData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword?: string; 
  govtId?: File; 
}

 export interface Message {
    _id: string;
    content: string;
    sender: string | { _id: string };
    senderModel: string;
    receiver: string | { _id: string };
    propertyId?: string;
    receiverModel: string;
    image?: string;
    images?: string[];

    createdAt: string;
  }
  

  export interface IUserResponse {
    users: IUser[] ;
    totalPages?:number;
    currentPage?:number;
    totalUsers?:IUser[];
  }
  
 