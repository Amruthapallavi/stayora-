import { useEffect, useState } from "react";
import { ScrollArea } from "../../components/ui/scroll-area";
import { notifyError, notifySuccess } from "../../utils/notifications";
import { useAuthStore } from "../../stores/authStore";
import io from 'socket.io-client';
import Notification from "./Notifications";
import { v4 as uuidv4 } from 'uuid';
import { IUser } from "../../types/user.interface";
import { MessageCircle } from "lucide-react";
import { cn } from "../lib/utils";

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isOwner: boolean;
}
interface ChatPanelProps {
    onSelectConversation: React.Dispatch<React.SetStateAction<string | null>>;
    selectedConversation: string | null;
    propertyId?: string;
    partner: IUser | null;
    messages: any[]; // use proper type if available
    conversations: {
      id: string;
      name: string;
      lastMessage: string;
      timestamp: string;
      unread: boolean;
      unreadCount: number;
    }[];
  }
  
  const ChatPanel: React.FC<ChatPanelProps> = ({
    onSelectConversation,
    selectedConversation,
    propertyId,
    partner,
    messages,
    conversations,
  }) => {
    const {sendMessage,user}=useAuthStore();
      const [messageText, setMessageText] = useState('');
      const [sending, setSending] = useState(false);
    //   const [messages,setMessages]=useState<Message[]>([]);
        const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
        // const [conversations, setConversations] = useState<any[]>([]);
        const [showNotification, setShowNotification] = useState(false);
        
        const formatChatTimestamp = (dateStr: string) => {
      const date = new Date(dateStr);
      const now = new Date();
  
      const isToday = date.toDateString() === now.toDateString();
      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);
      const isYesterday = date.toDateString() === yesterday.toDateString();
  
      if (isToday) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      } else if (isYesterday) {
        return "Yesterday";
      } else if (date.getFullYear() === now.getFullYear()) {
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' }); // e.g., "Apr 23"
      } else {
        return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }); // e.g., "Apr 10, 2023"
      }
    };
    useEffect(() => {
      setMessages(conversation || []);
      setConversations(conversation || []); // <- this sends it to parent
    }, [conversation]);
    
      console.log(partner,"partner")
 // Socket setup
 useEffect(() => {
    const socketInstance = io('http://localhost:8000');
    setSocket(socketInstance);
  
    return () => {
      socketInstance.disconnect();
    };
  }, []);
  
     // Send message
      const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!messageText.trim())) return;
        const newMessage = {
            id: uuidv4(), 
            content: messageText,
            timestamp: new Date().toISOString(),
            sender: user.id,
            isOwner: true,
          };
        try {
          setSending(true);
          const senderId = user.userId || user.id;
          const room = [senderId, selectedConversation].sort().join('-');
          
          const formData = new FormData();
          formData.append('sender', senderId);
          formData.append('senderModel', 'User');
          formData.append('receiver', selectedConversation || '');
          formData.append('receiverModel', 'Owner');
          formData.append('content', messageText);
          formData.append('room', room);
          formData.append('propertyId', propertyId);
          
        //   if (selectedFile) {
        //     formData.append('image', selectedFile);
        //   }
          
          // First, send the message to the server
          const response = await sendMessage(formData);
          const newMessage = response.data;
      
          setMessages(prev => {
            return [...prev, newMessage];
          });
      
          // Emit via socket only after the message state has been updated
          if (socket) {
            socket.emit('sendMessage', newMessage, room);
          }      
          // Update the conversations list
          setConversations(prev => {
            const updatedConversations = [...prev];
            const conversationIndex = updatedConversations.findIndex(conv => conv.partnerId === selectedConversation);
      
            if (conversationIndex !== -1) {
              updatedConversations[conversationIndex] = {
                ...updatedConversations[conversationIndex],
                lastMessage: messageText,
                lastMessageTime: new Date().toISOString(),
              };
              // Move this conversation to the top
              const [conversation] = updatedConversations.splice(conversationIndex, 1);
              updatedConversations.unshift(conversation);
            }
      
            return updatedConversations;
          });
          // Reset form
      setMessageText('');
      // setSelectedFile(null);
      // setImagePreview(null);
      notifySuccess("Message sent");
  
    } catch (err) {
      console.error('Send error:', err);
      notifyError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

    return (
        
      <div className="h-full flex flex-col">
           <ScrollArea className="h-[calc(100vh-12rem)] pr-4">
      <div className="space-y-2">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.id)}
            className={cn(
              "w-full p-3 rounded-lg transition-all duration-300",
              "hover:bg-[#b68451]/5 hover:scale-[1.02] border border-transparent",
              selectedId === conversation.id
                ? "bg-[#b68451]/10 border-[#b68451]/20 shadow-md"
                : "bg-white/50"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="relative">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    conversation.unread
                      ? "bg-[#b68451]/20 animate-pulse"
                      : "bg-[#b68451]/10"
                  )}
                >
                  {/* You can place an icon or initials here */}
                  {conversation.partner?.name?.charAt(0) || "U"}
                </div>
                {conversation.unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-semibold w-4 h-4 rounded-full flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                    {conversation.unreadCount > 9
                      ? "9+"
                      : conversation.unreadCount}
                  </span>
                )}

                <MessageCircle
                  size={20}
                  className={cn(
                    "text-[#b68451]",
                    conversation.unread && "animate-bounce"
                  )}
                />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-start mb-1">
                  <span
                    className={cn(
                      "font-medium truncate",
                      conversation.unread ? "text-[#b68451]" : "text-gray-800"
                    )}
                  >
                    {conversation.name}
                  </span>
                  <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                    {conversation.timestamp}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {conversation.lastMessage}
                </p>
              </div>
              {conversation.unread && (
                <div className="w-2 h-2 rounded-full bg-[#b68451] mt-2 animate-pulse" />
              )}
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
    <div className="md:col-span-2 space-y-6">
                <div className="h-[calc(100vh-22rem)] bg-white/70 backdrop-blur-md rounded-lg border border-[#b68451]/10 shadow-lg hover:shadow-xl transition-all duration-300">
                
        <div className="border-b border-[#b68451]/10 p-4">
          <h2 className="text-lg font-semibold text-[#b68451]">
            Chat with {partner.name || "Unknown"}
          </h2>
        </div>
  
        <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
  {messages.map((message) => {
    const isSentByUser = message.sender === user.userId || message.sender === user.id;

    return (
      <div
      
        key={message.id}
        className={`flex ${isSentByUser ? "justify-end" : "justify-start"}`}
      >
        {/* <Notification message="Message sent" isVisible={showNotification} /> */}

        <div
          className={`relative max-w-[80%] px-4 py-3 rounded-2xl text-sm shadow-md animate-fade-in ${
            isSentByUser
              ? "bg-[#b68451] text-white rounded-br-none"
              : "bg-white border border-[#b68451]/10 text-gray-800 rounded-bl-none"
          }`}
        >
          <p>{message.content}</p>
          <span className="text-[10px] opacity-70 mt-1 block text-right">
            {formatChatTimestamp(message.timestamp)}
          </span>
        </div>
      </div>
    );
  })}
</div>

        </ScrollArea>
  
        <div className="border-t border-[#b68451]/10 p-4">
  <form onSubmit={handleSendMessage} className="flex items-center gap-3">
    <input
      type="text"
      placeholder="Type your message..."
      value={messageText}
      onChange={(e) => setMessageText(e.target.value)}
      className="flex-1 px-4 py-2 rounded-full border border-[#b68451]/20 bg-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#b68451]/30 shadow-sm text-sm"
    />
    <button
      type="submit"
      disabled={sending || !messageText.trim()}
      className="px-5 py-2 rounded-full bg-[#b68451] text-white text-sm font-medium hover:bg-[#a2713d] disabled:opacity-50 transition-all"
    >
      Send
    </button>
  </form>

</div>


      </div>
      </div>
      </div>
      
      
    );
  };
  
  export default Chatpanel;
  

