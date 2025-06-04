import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "../../components/ui/scroll-area";
import { notifyError, notifySuccess } from "../../utils/notifications";
import { useAuthStore } from "../../stores/authStore";
import io from 'socket.io-client';
import Notification from "./Notifications";
import { v4 as uuidv4 } from 'uuid';
import { IUser } from "../../types/user";

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isOwner: boolean;
}

interface ConversationProps {
  conversation: any[];
  selectedConversation: string;
  propertyId: string;
  partner: IUser;
  onMessageSent?: (message: {
    content: string;
    timestamp: string;
  }) => void;
}



const Conversation = ({ conversation,selectedConversation,propertyId,partner ,onMessageSent}: ConversationProps) => {
    const {sendMessage,user}=useAuthStore();
      const [messageText, setMessageText] = useState('');
      const [sending, setSending] = useState(false);
      const [messages,setMessages]=useState<Message[]>([]);
        const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
        const [conversations, setConversations] = useState<any[]>([]);
        const [showNotification, setShowNotification] = useState(false);
        const messagesEndRef = useRef<HTMLDivElement | null>(null);

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
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, [messages]);
    
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
          if (onMessageSent) {
            onMessageSent({
              content: messageText,
              timestamp: new Date().toISOString(),
            });
          }
          
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
            const conversationIndex = updatedConversations.findIndex(
              conv => conv.partnerId === selectedConversation
            );
          
            if (conversationIndex !== -1) {
              updatedConversations[conversationIndex] = {
                ...updatedConversations[conversationIndex],
                lastMessage: {
                  content: messageText,
                  createdAt: new Date().toISOString(),
                },
              };
          
              const [conversation] = updatedConversations.splice(conversationIndex, 1);
              updatedConversations.unshift(conversation);
            }
          
            return updatedConversations;
          });
          if (onMessageSent) {
            onMessageSent(newMessage); // send the message to parent
          }
          
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
        <div ref={messagesEndRef} />

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
      
    );
  };
  
  export default Conversation;
  

