

export interface INotification {
  recipient: string;
  recipientModel: string;
  type: string;
  message: string;
  read: boolean;
  otherId?: string | null;
  createdAt: Date;
}

export interface INotificationApiResponse {
  data: INotification[];
  message: string;
}

export interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

export interface ConversationListProps {
  onSelectConversation: (id: string) => void;
  selectedId: string | null;
  onlineUsers:string[]|null;
  conversations: any[] | [];
}