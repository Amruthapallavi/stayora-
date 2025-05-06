import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { BellDot, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { notifyError, notifySuccess } from '../../utils/notifications';
import io from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';
import ConversationList from "../../components/chat/ConversationList";
import PropertySummary from "../../components/chat/PropertySummary";
import Conversation from "../../components/chat/Conversation";
import OwnerLayout from "../../components/owner/OwnerLayout";
import { IUser, Message } from "../../types/user.interface";
import moment from "moment";


const OwnerChatPage = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(
    null
  );
    const { user, getPropertyById,getNotifications, markMessagesAsRead, getConversation,listConversations } = useAuthStore();
    const [conversations, setConversations] = useState<any[]>([]);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [propertyData, setPropertyData] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [socket, setSocket] = useState<any>(null);
    const [partner,setPartner]= useState<IUser>();
    const [notifications,setNotifications]= useState<any[]>([]);
    const selectedConvObject = conversations.find(c => c._id === selectedConversation);
    const ownerId = selectedConvObject?.partner?._id; 
    const propertyId = selectedConvObject?.propertyId; 
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

   useEffect(() => {
      const fetchConversations = async () => {
        
        if (!user) return;
        try {
          const userId = user.userId || user.id;
          const res = await listConversations();
          setConversations(
            res.map((conv: any) => ({
              ...conv,
              partnerId: conv.partner?._id || conv.receiver?._id || conv.sender?._id,
              lastMessage: typeof conv.lastMessage === 'object' 
                ? conv.lastMessage 
                : { content: conv.lastMessage, createdAt: new Date().toISOString() } 
            }))
          );     
          } catch (error) {
          console.error("Failed to fetch conversations:", error);
          notifyError("Could not load conversations");
        } finally {
          setLoadingConversations(false);
        }
      };
      fetchConversations();
    }, [user,listConversations]);

    useEffect(() => {
      const fetchNotifications = async () => {
        try {
         const res= await getNotifications();
         setNotifications(res.data);
        } catch (err) {
          console.error("Failed to fetch notifications", err);
        }
      };
      fetchNotifications();
    }, [getNotifications]);
    
    const reloadData = async () => {
      try {
        const updatedConversations = await listConversations(); 
    
        setConversations(updatedConversations);
      } catch (err) {
        console.error("Failed to reload data:", err);
      }
    };
    useEffect(() => {
        const fetchSelectedProperty = async () => {
          if (!selectedConversation) return;
      
          const selected = conversations.find(c => c._id === selectedConversation);
          if (selected?.lastMessage.propertyId) {
            try {
              const res = await getPropertyById(selected.lastMessage.propertyId);
              setPropertyData(res.Property); 
              const result = await getConversation(user.id,selected.lastMessage.sender);
              setMessages(result.data);
              setPartner(result.chatPartner);
              await markMessagesAsRead(selectedConversation, user.id);
              await reloadData();

            } catch (err) {
              console.error('Failed to fetch property:', err);
              notifyError("Could not load property details");
            }
          }
        };
      
        fetchSelectedProperty();
      }, [selectedConversation, getPropertyById]);
      
        useEffect(() => {
          if (!user) return;
          const socketInstance = io('http://localhost:8000');
          setSocket(socketInstance);
        
          return () => {
            socketInstance.disconnect();
          };
        }, [user]);
        
// Join chat room
  useEffect(() => {
    if (!socket || !user || !ownerId) return;
  
    const senderId = user.userId || user.id;
    const room = [senderId, ownerId].sort().join('-');
    socket.emit('joinRoom', room);
  
    const handleReceiveMessage = (newMessage: Message) => {
      if (!messages.some(msg => msg._id === newMessage._id)) {
        setMessages(prev => [...prev, newMessage]);
      }
    
      setConversations(prev => {
        const updatedConversations = [...prev];
        const senderIdToCheck = typeof newMessage.sender === 'string' 
          ? newMessage.sender 
          : newMessage.sender._id;
          
        const conversationIndex = updatedConversations.findIndex(
          conv => conv.partnerId === senderIdToCheck
        );
        
        if (conversationIndex !== -1) {
          updatedConversations[conversationIndex] = {
            ...updatedConversations[conversationIndex],
            lastMessage: newMessage,
            lastMessageTime: newMessage.createdAt,
          };
      
          const [conversation] = updatedConversations.splice(conversationIndex, 1);
          updatedConversations.unshift(conversation);
        }
      
        return updatedConversations;
      });
      
    };
    
    socket.on('receiveMessage', handleReceiveMessage);
  
    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [socket, user, ownerId, messages]);
  
      // Scroll to bottom when messages change
  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [messages]); 
    //   useEffect(() => {
    //     if (!user ) return;
    //     const fetchConversation = async () => {
    //         console.log("adrrr")
    //         console.log(selectedConversation,"poioi")
    //         if (!selectedConversation) return;
    //         const selected = conversations.find(c => c._id === selectedConversation);
    //         console.log(selected,"foryyy")

    //       try {
    //         const senderId = user.userId || user.id;
    //         // const receiverId = ; // assuming ownerId is the partner's id
      
    //         // const result = await getConversation(senderId, receiverId); // pass both
    //         // if (result && result.data) {
    //         //   setMessages(result.data || []);
    //         //   console.log(result);
    //         //   if (result.data.partner) {
    //         //     setChatPartner(result.data.partner);
    //         //   }
    //         // }
    //       } catch (error) {
    //         console.error("Error fetching conversation:", error);
    //         notifyError("Failed to load conversation");
    //       }
    //     };
      
    //     fetchConversation();
    //   }, []);
      
useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNotificationClick = (notification:any) => {
    if (notification.type === 'booking') {
      navigate(`/owner/bookings/${notification.otherId}`);
    } else if (notification.type === 'property') {
      navigate(`/owner/property/${notification.otherId}`);
    }
  };
    function formatChatTimestamp(dateStr: string) {
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
          return date.toLocaleDateString([], { month: 'short', day: 'numeric' }); 
        } else {
          return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' }); 
        }
      }
      
  return (
    <OwnerLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">

        <Tabs defaultValue="chat" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="grid w-[400px] grid-cols-2 bg-[#b68451]/10 backdrop-blur-sm">
              <TabsTrigger
                value="chat"
                className="data-[state=active]:bg-[#b68451]/20 data-[state=active]:text-[#b68451] transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Messages
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="data-[state=active]:bg-[#b68451]/20 data-[state=active]:text-[#b68451] transition-all duration-300"
              >
                <BellDot className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="chat"
            className="mt-0 animate-[slideIn_0.4s_ease-out]"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 bg-white/70 backdrop-blur-md rounded-lg p-4 border border-[#b68451]/10 shadow-lg hover:shadow-xl transition-all duration-300">
                <h2 className="text-xl font-semibold text-[#b68451] mb-4">
                  Conversations
                </h2>
                <ConversationList
  onSelectConversation={setSelectedConversation}
  selectedId={selectedConversation}
  conversations={conversations.map((c) => ({
    id: c._id,
    name: c.partner?.name || "Unknown",
    lastMessage: c.lastMessage.content,
    timestamp: formatChatTimestamp(c.lastMessage.createdAt),
    unread: c.unreadCount > 0,
    unreadCount: c.unreadCount,
      }))}
/>

              </div>

              <div className="md:col-span-2 space-y-6">
              <div className="h-[calc(100vh-22rem)] bg-white/70 backdrop-blur-md rounded-lg border border-[#b68451]/10 shadow-lg hover:shadow-xl transition-all duration-300">
  {selectedConversation && partner ? (
    <Conversation
      conversation={messages}
      selectedConversation={selectedConversation}
      propertyId={propertyData?._id}
      partner={partner}
    />
  ) : (
    <div className="h-full flex items-center justify-center text-gray-500">
      Select a conversation to start messaging
    </div>
  )}
</div>

                {propertyData && (
  <PropertySummary property={propertyData} />
)}
              </div>
            </div>
          </TabsContent>

          <TabsContent
            value="notifications"
            className="mt-0 animate-[slideIn_0.4s_ease-out]"
          >
            <div className="bg-white/70 backdrop-blur-md rounded-lg p-6 border border-[#b68451]/10 shadow-lg">
              <div className="space-y-4">
              {notifications.map((notification, i) => (
        <div
          key={i}
          className="p-4 rounded-lg bg-white/80 border border-[#b68451]/10 hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer"
          onClick={() => handleNotificationClick(notification)}  
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#b68451]/10 flex items-center justify-center">
              <BellDot size={20} className="text-[#b68451]" />
            </div>
            <div>
              <h3 className="font-medium text-[#b68451]">
                New {notification.type} message received
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {notification.message}
              </p>
              {/* Time ago calculation using moment.js */}
              <span className="text-xs text-gray-500 mt-2 block">
                {moment(notification.createdAt).fromNow()} {/* Display time ago */}
              </span>
            </div>
          </div>
        </div>
      ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
      </div>
    </OwnerLayout>
  );
};

export default OwnerChatPage;
