
import { useEffect, useRef, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { notifyError, notifySuccess } from '../../utils/notifications';
import io from 'socket.io-client';
import UserLayout from '../../components/user/UserLayout';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Card } from '../../components/ui/card';
import {  CardContent,
  //  CardDescription, 
   CardHeader, CardTitle } from "../../components/ui/card";
import { Send, Paperclip, ChevronLeft, Info, User, Home, MessageSquare, ArrowLeft, Star } from 'lucide-react';
import { IProperty } from '../../types/IProperty';
import { Message } from '../../types/user.interface';
import NotificationsTab from '../../components/NotificationTab';
// import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
// import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';




interface ChatPartner {
  _id: string;
  name: string;
  email: string;
  phone:number;
  profileImage?: string;
}

const ChatPage = () => {
  let { propertyId, ownerId } = useParams();
  const { user, getPropertyById,getNotifications, sendMessage, markMessagesAsRead,getConversation, listConversations } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  
  const propertyData = location.state?.property as IProperty;
  const [property, setProperty] = useState<IProperty | null>(propertyData || null);
  const [loading, setLoading] = useState(true);
  const [loadingConversations, setLoadingConversations] = useState(true);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [messageText, setMessageText] = useState('');
  const [socket, setSocket] = useState<any>(null);
  const [sending, setSending] = useState(false);
  const [chatPartner, setChatPartner] = useState<ChatPartner | null>(null);
  const [notifications,setNotifications]= useState<any[]>([]);

  const [isMobileInfoVisible, setIsMobileInfoVisible] = useState(false);
  const [isMobileConversationsVisible, setIsMobileConversationsVisible] = useState(false);
  
  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // File upload state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user) return;
      try {
        const res = await listConversations();
  
        setConversations(
          res.map((conv: any) => ({
            ...conv,
            partnerId: conv.partner?._id || conv.receiver?._id || conv.sender?._id,
            lastMessage: typeof conv.lastMessage === 'object' 
              ? conv.lastMessage 
              : { content: conv.lastMessage, createdAt: new Date().toISOString() } // Add a fallback if it's not an object
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
    const fetchProperty = async () => {
      if (!propertyData && propertyId) {
        try {
          const res = await getPropertyById(propertyId);
          setProperty(res.Property);
        } catch (err) {
          console.error('Failed to fetch property:', err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [propertyId, propertyData, getPropertyById]);

  // Socket setup
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
      // Check if the message already exists in the state
      if (!messages.some(msg => msg._id === newMessage._id)) {
        setMessages(prev => [...prev, newMessage]);
      }
    
      // Update conversations list with new message
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
  
  // Fetch conversation history
  useEffect(() => {
    if (!user || !ownerId) return;
    
    const fetchConversation = async () => {
      try {
        const senderId = user.userId || user.id;
        const result = await getConversation(senderId, ownerId);
        
        if (result && result.data) {
          setMessages(result.data || []);
          
          if (result.data.partner) {
            setChatPartner(result.data.partner);
          }
        }
        setChatPartner(result.chatPartner);
        await markMessagesAsRead(ownerId, user.id);

      } catch (error) {
        console.error("Error fetching conversation:", error);
        notifyError("Failed to load conversation");
      }
    };
    fetchConversation();
  }, [user, ownerId, getConversation]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // File upload handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };
  const reloadData = async () => {
    try {
      const updatedConversations = await listConversations(); // your API call
  
      setConversations(updatedConversations);
    } catch (err) {
      console.error("Failed to reload data:", err);
    }
  };
  
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
       const res= await getNotifications();
       setNotifications(res.data);
       console.log(res,"for notificationn")
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };
    fetchNotifications();
  }, [getNotifications]);
  // Send message handler
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!messageText.trim()) || !property) return;
  
    try {
      setSending(true);
      const senderId = user?.userId || user?.id;
      const room = [senderId, ownerId].sort().join('-');
      
      const formData = new FormData();
      formData.append('sender', senderId || '');
      formData.append('senderModel', 'User');
      formData.append('receiver', ownerId || '');
      formData.append('receiverModel', 'Owner');
      formData.append('content', messageText);
      formData.append('room', room);
      formData.append('propertyId', property._id);
      
      if (selectedFile) {
        formData.append('image', selectedFile);
      }
      
      const response = await sendMessage(formData);
      const newMessage = response.data;
  
      // setMessages(prev => [...prev, newMessage]);
      if (socket) {
        socket.emit('sendMessage', newMessage, room);
      }
      await reloadData();

      // Update the conversations list
      setConversations(prev => {
        const updatedConversations = [...prev];
        const conversationIndex = updatedConversations.findIndex(conv => conv.partnerId === ownerId);
      
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
      
      
      // Reset form
      setMessageText('');
      setSelectedFile(null);
      setImagePreview(null);
      notifySuccess("Message sent");
  
    } catch (err) {
      console.error('Send error:', err);
      notifyError('Failed to send message');
    } finally {
      setSending(false);
    }
  };
  
  // Format date helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  // Loading state
  if (loading) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="bg-gray-50 min-h-screen">
        <div className="container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-4">
    <Button
      onClick={() => navigate(-1)}
      variant="ghost"
      className="inline-flex items-center text-gray-600 hover:text-yellow-600 transition"
    >
      <ArrowLeft size={18} className="mr-2" />
      <span>Back</span>
    </Button>

    <div>
    <NotificationsTab notifications={notifications} />
    </div>
  </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[85vh]">
            {/* Mobile Controls */}
            <div className="md:hidden flex justify-between mb-2">
              <Button
                onClick={() => setIsMobileConversationsVisible(!isMobileConversationsVisible)}
                variant="outline"
                className="flex items-center text-yellow-600"
              >
                <MessageSquare size={20} className="mr-1" /> 
                {isMobileConversationsVisible ? "Hide Chats" : "Show Chats"}
              </Button>
              <Button
                onClick={() => setIsMobileInfoVisible(!isMobileInfoVisible)}
                variant="outline"
                className="flex items-center text-yellow-600"
              >
                <Info size={20} className="mr-1" /> 
                {isMobileInfoVisible ? "Hide Info" : "Property Info"}
              </Button>
            </div>
    
            {/* Conversations List */}
            <div 
              className={`
                ${isMobileConversationsVisible ? 
                  'absolute z-10 top-16 left-0 right-0 bg-white p-4 shadow-xl rounded-lg m-2' : 
                  'hidden md:block'
                } 
                md:col-span-3 md:static
              `}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Conversations</h2>
                {isMobileConversationsVisible && (
                  <button onClick={() => setIsMobileConversationsVisible(false)} className="text-gray-500">
                    <ChevronLeft />
                  </button>
                )}
              </div>
              
              <div className="relative mb-4">
                <Input
                  type="text"
                  placeholder="Search conversations..."
                  className="pl-10"
                />
                <div className="absolute left-3 top-2.5 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              
              <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 120px)' }}>
                {loadingConversations ? (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare size={40} className="mx-auto mb-2 opacity-50" />
                    <p>No conversations yet</p>
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <div
                      key={conversation.partnerId}
                      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                        conversation.partnerId === ownerId
                          ? 'bg-yellow-50 border-l-4 border-yellow-500'
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => {
                        navigate(`/user/chat/${conversation.lastMessage?conversation.lastMessage.propertyId:propertyId || propertyId}/${conversation.partner._id}`);
                        propertyId= conversation.lastMessage?.propertyId;
                      }}
                    >
                      <Avatar className="h-12 w-12 mr-3">
                        <AvatarImage 
                          src={conversation.partner?.profileImage} 
                          alt={conversation.partner?.name} 
                        />
                        <AvatarFallback className="bg-yellow-100 text-yellow-800">
                          {conversation.partner?.name?.charAt(0) || <User size={20} />}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="font-semibold text-gray-800 truncate">
                            {conversation.partner?.name || "Unknown"}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {conversation.lastMessage?.createdAt && 
                              formatDate(conversation.lastMessage.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage?.content || "No messages yet"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {/* Chat Messages */}
            <div 
              className="md:col-span-6 flex flex-col bg-white rounded-lg shadow-md overflow-hidden"
              style={{ height: '85vh' }}
            >
              {/* Chat Header */}
              <div className="p-4 border-b bg-white flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={chatPartner?.profileImage} alt={chatPartner?.name} />
                  <AvatarFallback className="bg-yellow-100 text-yellow-800">
                    {chatPartner?.name?.charAt(0) || <User size={20} />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-bold">{chatPartner?.name || "Chat"}</h3>
                  <p className="text-xs text-gray-500">
                    {chatPartner?.email || ""}
                  </p>
                </div>
              </div>
              
              {/* Messages Container */}
              <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4"
              >
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <MessageSquare size={48} className="mb-2 opacity-30" />
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const senderId = typeof msg.sender === 'string' ? msg.sender : msg.sender._id;
                    const isOwnMessage = senderId === (user?.userId || user?.id);
                    const showAvatar = i === 0 || 
                      (messages[i-1] && (typeof messages[i-1].sender === 'string' 
                        ? messages[i-1].sender 
                        : messages[i-1].sender._id) !== senderId);
                    
                    return (
                      <div
                      key={msg._id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isOwnMessage && showAvatar && (
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={chatPartner?.profileImage} alt={chatPartner?.name} />
                            <AvatarFallback className="bg-gray-100">
                              {chatPartner?.name?.charAt(0) || <User size={16} />}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        
                        <div className={`flex flex-col ${!isOwnMessage && !showAvatar ? 'ml-10' : ''}`}>
                          <div 
                            className={`px-4 py-2 rounded-lg max-w-xs md:max-w-md break-words ${
                              isOwnMessage 
                                ? 'bg-yellow-600 text-white rounded-br-none'
                                : 'bg-white border border-gray-200 rounded-bl-none'
                            }`}
                          >
                            {msg.content}
                            {Array.isArray(msg.images) && msg.images.length > 0 && (
  <div className="mt-2">
    {msg.images.map((img, idx) => (
      <img 
        key={idx} 
        src={img} 
        alt="Message attachment" 
        className="rounded max-w-full h-auto"
      />
    ))}
  </div>
)}

                          </div>
                          <div className={`text-xs text-gray-500 mt-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
</div>

                        </div>
                        
                        {isOwnMessage && showAvatar && (
                          <Avatar className="h-8 w-8 ml-2">
                            <AvatarImage src={user?.profileImage} alt="You" />
                            <AvatarFallback className="bg-yellow-100 text-yellow-800">
                              {user?.name?.charAt(0) || <User size={16} />}
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="p-2 border-t bg-gray-50">
                  <div className="relative inline-block">
                    <img src={imagePreview} alt="Upload preview" className="h-20 rounded" />
                    <button 
                      onClick={handleCancelUpload}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              )}
              
              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t bg-white flex items-center">
                <label className="cursor-pointer mr-2 text-gray-500 hover:text-yellow-600">
                  <Paperclip size={20} />
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
                <Input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 rounded-full"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                <Button
                  type="submit"
                  className="ml-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-full w-10 h-10 p-0 flex items-center justify-center"
                  disabled={sending || (!messageText.trim() && !selectedFile)}
                >
                  {sending ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <Send size={18} />
                  )}
                </Button>
              </form>
            </div>
            
            {/* Property Info */}
           {/* Property Info */}
           <div 
              className={`
                ${isMobileInfoVisible ? 
                  'absolute z-10 top-16 left-0 right-0 bg-white p-4 shadow-xl rounded-lg m-2' : 
                  'hidden md:block'
                } 
                md:col-span-3 md:static
              `}
            >
              <Card className="h-full overflow-hidden">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle>Property Info</CardTitle>
                  {isMobileInfoVisible && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsMobileInfoVisible(false)}
                    >
                      <ChevronLeft size={16} />
                    </Button>
                  )}
                </CardHeader>
                
                <div className="flex-1 overflow-y-auto">
                  {property?.images && property.images.length > 0 ? (
                    <img 
                      src={property.images[0]} 
                      alt={property.title} 
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <Home size={48} className="text-gray-400" />
                    </div>
                  )}
                  
                  <CardContent className="pt-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center justify-between">
                      <span>{property?.title}</span>
                      <Button variant="ghost" size="sm" className="p-1 text-yellow-600">
                        <Star size={18} />
                      </Button>
                    </h3>
                    
                    {property?.rentPerMonth && (
                      <div className="flex items-center mb-3">
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold">
                        ₹{property.rentPerMonth}/month
                        </span>
                      </div>
                    )}
                    
                    {(property?.bedrooms || property?.bathrooms) && (
                      <div className="flex justify-start gap-6 mb-4 bg-gray-50 p-2 rounded-lg">
                        {property.bedrooms && (
                          <div className="flex items-center">
                            <span className="text-gray-700 font-medium">{property.bedrooms}</span>
                            <span className="text-gray-600 ml-1">Bed</span>
                          </div>
                        )}
                        {property.bathrooms && (
                          <div className="flex items-center">
                            <span className="text-gray-700 font-medium">{property.bathrooms}</span>
                            <span className="text-gray-600 ml-1">Bath</span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Description</h4>
                      <p className="text-gray-600 text-sm">{property?.description}</p>
                    </div>
                    
                    {property?.features && property.features.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Amenities</h4>
                        <div className="flex flex-wrap gap-2">
                          {property.features.map((amenity, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {chatPartner && (
                      <div className="mt-6 pt-4 border-t">
                        <h4 className="font-semibold text-gray-800 mb-2">Owner Details</h4>
                        <div className="flex items-center bg-yellow-50 p-3 rounded-lg">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={chatPartner.profileImage} alt={chatPartner.name} />
                            <AvatarFallback className="bg-yellow-100 text-yellow-800">
                              {chatPartner.name.charAt(0) || <User size={20} />}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h5 className="font-medium">{chatPartner.name}</h5>
                            <p className="text-sm text-gray-500">{chatPartner.email}</p>
                            <p className="text-sm text-gray-500">{chatPartner.phone}</p>

                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-4 pt-4 border-t">
                    <Button 
  variant="outline"
  className="w-full border-yellow-500 text-yellow-600 hover:bg-yellow-50"
  onClick={() => navigate(`/user/property/${property?._id || ''}`)}
>
  View Full Property Details
</Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default ChatPage;
