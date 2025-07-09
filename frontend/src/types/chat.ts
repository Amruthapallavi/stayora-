export interface IMessage {
  content: string;
  createdAt: string;
  isRead: boolean;
}

export interface IPartner {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  allowedProperties?: number;
  createdAt: string;
  govtId: string;
  govtIdStatus: string;
  houses?: string[]; 
  isSubscribed: boolean;
  isVerified: boolean;
  otp: string;
  otpExpires: string | null;
  rejectionReason: string | null;
  status: string;
  subscriptionEnd: string | null;
  subscriptionPlan: string;
  subscriptionPrice: number;
  subscriptionStart: string | null;
  updatedAt: string;
  __v: number;
}

export interface IChatThread {
  _id: string;
  propertyId: string;
  sender: string;
  receiver: string;
  partner: string | IPartner;
  lastMessage: IMessage;
  messagesCount: number;
  unreadCount: number;
  ownerPartner: IPartner[];
}


export interface IUpdateReadResponse {
  success: boolean;
  updatedCount: {
    data: {
      updatedCount: number;
    };
    message: string;
    status: number;
  };
}

interface IChatMessage {
  _id: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  propertyId: string;
  receiver: string;
  receiverModel: string;
  sender: string;
  senderModel: string;
  timestamp: string;
  __v: number;
}
interface IChatPartner {
  _id: string;
  address: Record<string, unknown>;
  createdAt: string;
  email: string;
  govtId: string;
  govtIdStatus: string;
  isSubscribed: boolean;
  isVerified: boolean;
  name: string;
  phone: number;   

  rejectionReason: string | null;
  status: string;
  subscriptionEnd: string | null;
  subscriptionStart: string | null;
  updatedAt: string;
}


export interface IConversationResponse {
  message: string;
  data: IChatMessage[];
  chatPartner: IChatPartner;
}

export interface ISendMessageData {
  userId: string;
  receiverId: string;
  propertyId: string;
  content: string;
  room: string;
  image: string; 
}