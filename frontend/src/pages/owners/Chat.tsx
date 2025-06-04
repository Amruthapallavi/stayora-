import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { BellDot, MessageCircle } from "lucide-react";
import { useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { notifyError,
  //  notifySuccess
   } from '../../utils/notifications';
import io from 'socket.io-client';
import ConversationList from "../../components/chat/ConversationList";
import PropertySummary from "../../components/chat/PropertySummary";
import Conversation from "../../components/chat/Conversation";
import OwnerLayout from "../../components/owner/OwnerLayout";
import { IUser, Message } from "../../types/user";
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
    // const propertyId = selectedConvObject?.propertyId; 
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

    const {markNotificationAsRead}=useAuthStore();

    const navigate = useNavigate();
    useEffect(() => {
      const fetchConversations = async () => {
        if (!user) return; 
    
        setLoadingConversations(true); 
    
        try {
          // const userId = user.userId || user.id; 
          const res = await listConversations(); 
    console.log(res,"for chat")
          setConversations(
            res.map((conv: any) => ({
              ...conv,
              partnerId: conv.partner?._id || conv.receiver?._id || conv.sender?._id || '',
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
    }, [user, listConversations]); 
    
useEffect(() => {
  if (!socket) return;

  socket.on("onlineUsers", (userIds: string[]) => {
    setOnlineUsers(userIds);
  });

  return () => {
    socket.off("onlineUsers");
  };
}, [socket]);
console.log(onlineUsers,"users online")
    useEffect(() => {
      const fetchNotifications = async () => {
        try {
         const res= await getNotifications();
         console.log(res,"for chat notifications")
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
          const socketInstance = io("http://localhost:8000",{
    query: {
    userId: user.id, 
  },
})
          setSocket(socketInstance);
        
          return () => {
            socketInstance.disconnect();
          };
        }, [user]);
        
  useEffect(() => {
    if (!socket || !user || !ownerId) {
      console.log("Waiting for socket, user, or ownerId...");
      return; 
    }
  
    const senderId = user.userId || user.id;
    const room = [senderId, ownerId].sort().join('-');
    socket.emit('joinRoom', room);
  
    const handleReceiveMessage = (newMessage: Message) => {
      const myId = user?.userId || user?.id;
      const senderId = typeof newMessage.sender === 'string' ? newMessage.sender : newMessage.sender._id;
const receiverId =
  typeof newMessage.receiver === "string"
    ? newMessage.receiver
    : (newMessage.receiver as { _id: string })._id;
    
      const isSentByMe = senderId === myId;
      const chatPartnerId = isSentByMe ? receiverId : senderId;
      const isRelevantToCurrentChat = selectedConversation === chatPartnerId;
    
      if (!isSentByMe && isRelevantToCurrentChat && !messages.some(msg => msg._id === newMessage._id)) {
        setMessages(prev => [...prev, newMessage]);
      }
    
      setConversations(prev => {
        let updated = prev.map(conv => {
          const partnerId = conv.partner?._id || conv._id;
          if (partnerId === chatPartnerId) {
            return {
              ...conv,
              lastMessage: newMessage,
              lastMessageTime: newMessage.createdAt,
              unreadCount: isRelevantToCurrentChat ? 0 : (conv.unreadCount || 0) + (isSentByMe ? 0 : 1),
            };
          }
          return conv;
        });
    
        const index = updated.findIndex(conv => {
          const partnerId = conv.partner?._id || conv._id;
          return partnerId === chatPartnerId;
        });
    
        if (index !== -1) {
          const [updatedConv] = updated.splice(index, 1);
          updated.unshift(updatedConv);
        } else {
          updated.unshift({
            partnerId: chatPartnerId,
            partner: isSentByMe ? newMessage.receiver : newMessage.sender,
            lastMessage: newMessage,
            lastMessageTime: newMessage.createdAt,
            unreadCount: isRelevantToCurrentChat || isSentByMe ? 0 : 1,
          });
        }
    
        return updated;
      });
    };
    
    
    
    socket.on('receiveMessage', handleReceiveMessage);
  
    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
    };
  }, [socket, user, ownerId, messages]);
  
 useEffect(() => {
  if (!selectedConversation || !user?.id || messages.length === 0) return;

  const lastMessage = messages[messages.length - 1];
  const senderId = typeof lastMessage.sender === 'string' ? lastMessage.sender : lastMessage.sender._id;

  if (senderId !== user.id) {
    (async () => {
      try {
        await markMessagesAsRead(selectedConversation, user.id);
        setConversations(prev =>
          prev.map(conv =>
            conv.partnerId === selectedConversation
              ? { ...conv, unreadCount: 0 }
              : conv
          )
        );
      } catch (err) {
        console.error('Error marking messages as read:', err);
      }
    })();
  }
}, [messages, selectedConversation, user]);


  const handleNotificationClick = async (notification:any) => {
    await  markNotificationAsRead(notification._id) 

    if (notification.type === 'booking') {
      console.log(notification,"noti")
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
    

const unreadCount = notifications.filter(n => !n.read).length;
 if (loadingConversations) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-golden"></div>
      </div>
    );
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
  className="relative data-[state=active]:bg-[#b68451]/20 data-[state=active]:text-[#b68451] transition-all duration-300"
>
  <BellDot className="w-4 h-4 mr-2" />
  Notifications
  {unreadCount > 0 && (
    <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold text-white bg-red-600 rounded-full">
      {unreadCount}
    </span>
  )}
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
    onlineUsers={onlineUsers}

  conversations={conversations.map((c) => ({
    id: c._id, 
      partnerId: c.partner?._id, 

    name: c.partner?.name || "Unknown",
    lastMessage: c.lastMessage?.content || "No messages",
    timestamp: formatChatTimestamp(c.lastMessage?.createdAt),
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
 onMessageSent={(message) => {
   setConversations(prev => {
     const updated = [...prev];
     const index = updated.findIndex(
      
       c => c.partnerId === selectedConversation
     );
     if (index !== -1) {
       updated[index] = {
         ...updated[index],
         lastMessage: {
           content: message.content,
           createdAt: message.timestamp,
         },
       };
       const [conv] = updated.splice(index, 1);
       updated.unshift(conv);
     }
     return updated;
   });
 }}
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
              {notifications && (
    <div className="flex items-center justify-between mb-4 px-1">
      <h2 className="text-lg font-semibold text-[#b68451]">Notifications</h2>
      <span className="text-sm text-red-600">
        {notifications.filter(n => !n.read).length} unread
      </span>
    </div>
  )}
      

            <div className="bg-white/70 backdrop-blur-md rounded-lg p-6 border border-[#b68451]/10 shadow-lg">
              <div className="space-y-4">
              {notifications.map((notification, i) => (
      <div
      key={i}
      className={`relative p-4 rounded-lg border border-[#b68451]/10 hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-pointer
        ${!notification.read ? 'bg-yellow-50' : 'bg-white/80'}`}
      onClick={() => handleNotificationClick(notification)}
    >
      {/* Unread dot */}
      {!notification.read && (
        <span className="absolute top-2 right-2 bg-red-500 w-2.5 h-2.5 rounded-full"></span>
      )}
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
          <span className="text-xs text-gray-500 mt-2 block">
            {moment(notification.createdAt).fromNow()}
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
