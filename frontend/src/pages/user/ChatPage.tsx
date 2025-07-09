import { useEffect, useRef, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { notifyError, notifySuccess } from "../../utils/notifications";
import io from "socket.io-client";
import UserLayout from "../../components/user/UserLayout";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Card } from "../../components/ui/card";
import {
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Send,
  Paperclip,
  ChevronLeft,
  Info,
  User,
  Home,
  MessageSquare,
  ArrowLeft,
  Star,
  Smile,
} from "lucide-react";
import { IProperty } from "../../types/property";
import { Message } from "../../types/user";
import NotificationsTab from "../../components/NotificationTab";
import Navbar from "../../components/user/Navbar";
import EmojiPicker from 'emoji-picker-react';

interface ChatPartner {
  _id: string;
  name: string;
  email: string;
  phone: number;
  profileImage?: string;
}

const ChatPage = () => {
  let { propertyId, ownerId } = useParams();
  const {
    user,
    getPropertyById,
    getNotifications,
    sendMessage,
    markMessagesAsRead,
    getConversation,
    listConversations,
  } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  const propertyData = location.state?.property as IProperty;
  const [property, setProperty] = useState<IProperty | null>(
    propertyData || null
  );
  const [loading, setLoading] = useState(true);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [messageText, setMessageText] = useState("");
  const [socket, setSocket] = useState<any>(null);
  const [sending, setSending] = useState(false);
  const [chatPartner, setChatPartner] = useState<ChatPartner | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
const [emojiPickerPosition, setEmojiPickerPosition] = useState({ top: 0, left: 0 });

  const [isMobileInfoVisible, setIsMobileInfoVisible] = useState(false);
  const [isMobileConversationsVisible, setIsMobileConversationsVisible] =
    useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, [user, listConversations]);

  const fetchConversations = async () => {
    if (!user) return;
    try {
      const res = await listConversations();
      setConversations((prevConversations) =>
        res.map((conv: any) => {
          const partnerId =
            conv.partner?._id || conv.receiver?._id || conv.sender?._id;

          const localConv = prevConversations.find(
            (prev) => (prev.partner?._id || prev.partnerId) === partnerId
          );

          const fetchedLastMessage =
            typeof conv.lastMessage === "object"
              ? conv.lastMessage
              : {
                  content: conv.lastMessage,
                  createdAt: new Date().toISOString(),
                };

          const localLastMessage = localConv?.lastMessage;

          const lastMessage =
            new Date(fetchedLastMessage?.createdAt) >
            new Date(localLastMessage?.createdAt || 0)
              ? fetchedLastMessage
              : localLastMessage;

          return {
            ...conv,
            partnerId,
            lastMessage,
            unreadCount: conv.unreadCount || 0,
          };
        })
      );
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
      notifyError("Could not load conversations");
    } finally {
      setLoadingConversations(false);
    }
  };

  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const handleEmojiClick = (emojiObject: any) => {
    setMessageText(prevText => prevText + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

 const handleEmojiButtonClick = (e: React.MouseEvent) => {
  e.preventDefault();
  e.stopPropagation();
  
  const rect = e.currentTarget.getBoundingClientRect();
  const pickerHeight = 350; 
  
  const top = rect.top - pickerHeight < 0 
    ? rect.bottom + 5 
    : rect.top - pickerHeight - 5;
    
  const left = Math.max(10, rect.left - 150); 
  
  setEmojiPickerPosition({ top, left });
  setShowEmojiPicker(!showEmojiPicker);
};

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showEmojiPicker && 
          !emojiButtonRef.current?.contains(event.target as Node) &&
          !(event.target as Element)?.closest('.EmojiPickerReact')) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  useEffect(() => {
    if (!socket) return;

    socket.on("onlineUsers", (userIds: string[]) => {
      setOnlineUsers(userIds);
    });

    return () => {
      socket.off("onlineUsers");
    };
  }, [socket]);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyData && propertyId) {
        try {
          const res = await getPropertyById(propertyId);
          setProperty(res.Property);
        } catch (err) {
          console.error("Failed to fetch property:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [propertyId, propertyData, getPropertyById]);

  useEffect(() => {
    if (!user) return;
    const socketInstance = io(
  import.meta.env.DEV ? "http://localhost:8000" : "https://api.amrithap.live",
  {
    query: {
      userId: user.id,
    },
    transports: ["websocket"],
  }
);
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!socket || !user || !ownerId) return;

    const senderId = user.userId || user.id;
    const room = [senderId, ownerId].sort().join("-");
    socket.emit("joinRoom", room);

   const handleReceiveMessage = (newMessage: Message) => {
  const currentUserId = user?.userId || user?.id;

  const senderId =
    typeof newMessage.sender === "string"
      ? newMessage.sender
      : newMessage.sender._id;

  const receiverId =
    typeof newMessage.receiver === "string"
      ? newMessage.receiver
      : newMessage.receiver._id;

  const partnerId = senderId === currentUserId ? receiverId : senderId;

  const isMessageForSelectedConversation =
    (senderId === currentUserId && receiverId === ownerId) ||
    (receiverId === currentUserId && senderId === ownerId);

  // Only add to messages if it's for the currently selected conversation
  if (
    isMessageForSelectedConversation &&
    !messages.some((msg) => msg._id === newMessage._id)
  ) {
    setMessages((prev) => [...prev, newMessage]);
    const senderId = user.userId || user.id;
    markMessagesAsRead(ownerId, senderId).catch((err) =>
      console.error("Failed to mark as read", err)
    );
  }

  // Update conversations list for ALL incoming messages
  setConversations((prev) => {
    const updatedConversations = [...prev];
    const conversationIndex = updatedConversations.findIndex(
      (conv) =>
        conv.partnerId === partnerId ||
        (conv.partner && conv.partner._id === partnerId)
    );

    if (conversationIndex !== -1) {
      // Update existing conversation
      const existing = updatedConversations[conversationIndex];
      const updated = {
        ...existing,
        lastMessage: newMessage,
        lastMessageTime: newMessage.createdAt,
     
        unreadCount: isMessageForSelectedConversation || senderId === currentUserId
          ? 0  
          : (existing.unreadCount || 0) + 1,
      };
      
      // Remove from current position and add to top
      updatedConversations.splice(conversationIndex, 1);
      updatedConversations.unshift(updated);
    } else {
      // Create new conversation
      const newConversation = {
        partnerId,
        partner:
          senderId === currentUserId
            ? newMessage.receiver
            : newMessage.sender,
        lastMessage: newMessage,
        lastMessageTime: newMessage.createdAt,
        // Only set unread count to 1 if message is not for current conversation and not sent by current user
        unreadCount: isMessageForSelectedConversation || senderId === currentUserId ? 0 : 1,
      };
      updatedConversations.unshift(newConversation);
    }

    return updatedConversations;
  });
};

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, user, ownerId, messages]);

  useEffect(() => {
    if (!user || !ownerId) return;

    const fetchConversation = async () => {
      try {
        const senderId = user.userId || user.id;
        const result = await getConversation(senderId, ownerId);
console.log(result,"checking partner");
        if (result && result.data) {
          setMessages(result.data || []);

          if (result.chatPartner) {
            setChatPartner(result.chatPartner);
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      const maxSize = 5 * 1024 * 1024; 
      if (file.size > maxSize) {
        notifyError("File size should be less than 5MB");
        return;
      }
      
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        notifyError("Please select a valid image file (JPG, PNG, GIF, WebP)");
        return;
      }
      
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
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
          notifyError("File size should be less than 5MB");
          return;
        }
        
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          notifyError("Please select a valid image file");
          return;
        }
        
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        notifyError("Please drop an image file");
      }
    }
  };

  const reloadData = async () => {
    try {
      const updatedConversations = await listConversations();
      setConversations(updatedConversations);
    } catch (err) {
      console.error("Failed to reload data:", err);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications();
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };
    fetchNotifications();
  }, [getNotifications]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!messageText.trim() && !selectedFile) || !property) return;

    try {
      setSending(true);
      const senderId = user?.userId || user?.id;
      const room = [senderId, ownerId].sort().join("-");

      const formData = new FormData();
      formData.append("sender", senderId || "");
      formData.append("senderModel", "User");
      formData.append("receiver", ownerId || "");
      formData.append("receiverModel", "Owner");
      formData.append("content", messageText || ""); // Allow empty text if image is present
      formData.append("room", room);
      formData.append("propertyId", property._id);

      if (selectedFile) {
        formData.append("image", selectedFile);
      }
      const response = await sendMessage(formData);
      const newMessage = response.data;
      
      // setMessages(prev => [...prev, newMessage]);
      
      await reloadData();
      
      if (socket) {
        socket.emit("sendMessage", newMessage, room);
      }

      setConversations((prev) => {
        const updatedConversations = [...prev];
        const index = updatedConversations.findIndex(
          (conv) => conv.partnerId === ownerId || conv.partner?._id === ownerId
        );

        const newConv = {
          partnerId: ownerId,
          partner: property?.ownerId || { _id: ownerId },
          lastMessage: newMessage,
          lastMessageTime: newMessage.createdAt,
          unreadCount: 0,
        };
        if (index !== -1) {
          updatedConversations[index] = {
            ...updatedConversations[index],
            ...newConv,
          };
          const [moved] = updatedConversations.splice(index, 1);
          return [moved, ...updatedConversations];
        } else {
          return [newConv, ...updatedConversations];
        }
      });

      setMessageText("");
      setSelectedFile(null);
      setImagePreview(null);
      notifySuccess("Message sent");
      await fetchConversations();
    } catch (err) {
      console.error("Send error:", err);
      notifyError("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderMessageContent = (msg: Message, isOwnMessage: boolean) => {
    return (
      <div
        className={`px-4 py-2 rounded-lg max-w-xs md:max-w-md break-words ${
          isOwnMessage
            ? "bg-yellow-600 text-white rounded-br-none"
            : "bg-white border border-gray-200 rounded-bl-none"
        }`}
      >
        {/* Text content */}
        {msg.content && (
          <div className={(msg.image || msg.images?.length) ? "mb-2" : ""}>
  {msg.content}
</div>

        )}
        
        {/* Single image field */}
        {msg.image && (
          <div className="mt-2">
            <img
              src={msg.image}
              alt="Message attachment"
              className="rounded max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => window.open(msg.image, '_blank')}
              style={{ maxHeight: '200px' }}
            />
          </div>
        )}
        
        {/* Multiple images field */}
        {Array.isArray(msg.images) && msg.images.length > 0 && (
          <div className="mt-2 space-y-2">
            {msg.images.map((img, idx) => (
              <div key={idx} className="relative">
                <img
                  src={img}
                  alt="Message attachment"
                  className="rounded max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(img, '_blank')}
                  style={{ maxHeight: '200px' }}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

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
    
      <div className="bg-gray-50 min-h-screen ">
        <Navbar/>
 <div className="container mx-auto py-6 px-4 pt-30">    
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
                onClick={() =>
                  setIsMobileConversationsVisible(!isMobileConversationsVisible)
                }
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
                ${
                  isMobileConversationsVisible
                    ? "absolute z-10 top-16 left-0 right-0 bg-white p-4 shadow-xl rounded-lg m-2"
                    : "hidden md:block"
                } 
                md:col-span-3 md:static
              `}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Conversations
                </h2>
                {isMobileConversationsVisible && (
                  <button
                    onClick={() => setIsMobileConversationsVisible(false)}
                    className="text-gray-500"
                  >
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <div
                className="space-y-2 overflow-y-auto px-2"
                style={{ maxHeight: "calc(85vh - 120px)" }}
              >
                {loadingConversations ? (
                  <div className="flex justify-center p-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500"></div>
                  </div>
                ) : conversations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare
                      size={40}
                      className="mx-auto mb-2 opacity-50"
                    />
                    <p>No conversations yet</p>
                  </div>
                ) : (
                  conversations.map((conversation) => (
                    <div
                      key={conversation.partnerId}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer shadow-sm ${
                        conversation.partnerId === ownerId
                          ? "bg-yellow-50 border-l-4 border-yellow-500"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={async (e) => {
                        e.preventDefault();
                        try {
                          await markMessagesAsRead(
                            conversation.partner._id,
                            user.id
                          );

                          setConversations((prev) =>
                            prev.map((conv) => {
                              const partnerId = conv.partner?._id || conv._id;
                              if (partnerId === conversation.partner._id) {
                                return { ...conv, unreadCount: 0 };
                              }
                              return conv;
                            })
                          );
                          navigate(
                            `/user/chat/${
                              conversation.lastMessage?.propertyId || propertyId
                            }/${conversation.partner._id}`
                          );
                        } catch (err) {
                          console.error(
                            "Failed to mark messages as read:",
                            err
                          );
                        }
                      }}
                    >
                      {/* Avatar + Online Dot */}
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={conversation.partner?.profileImage}
                            alt={conversation.partner?.name}
                          />
                          <AvatarFallback className="bg-yellow-100 text-yellow-800">
                            {conversation.partner?.name?.charAt(0) || (
                              <User size={20} />
                            )}
                          </AvatarFallback>
                        </Avatar>
                        {onlineUsers.includes(
                          String(conversation.partner?._id)
                        ) && (
                          <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></span>
                        )}
                      </div>

                      {/* Main Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-0.5">
                          <h3 className="font-medium text-gray-800 truncate max-w-[140px]">
                            {conversation.partner?.name}
                          </h3>
                          <span className="text-xs text-gray-400 shrink-0">
                            {conversation.lastMessage?.createdAt &&
                              formatDate(conversation.lastMessage.createdAt)}
                          </span>
                        </div>

                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-600 truncate max-w-[180px]">
                            {conversation.lastMessage?.image ? "📷 Image" : 
                             conversation.lastMessage?.content ||
                             "No messages yet"}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shrink-0">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
{/* Chat Messages */}
            <div
              className={`md:col-span-6 flex flex-col bg-white rounded-lg shadow-md overflow-hidden ${
                isDragOver ? 'ring-2 ring-yellow-500 ring-opacity-50' : ''
              }`}
              style={{ height: "85vh" }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {/* Chat Header */}
              <div className="p-4 border-b bg-white flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage
                    src={chatPartner?.profileImage}
                    alt={chatPartner?.name}
                  />
                  <AvatarFallback className="bg-yellow-100 text-yellow-800">
                    {chatPartner?.name?.charAt(0) || <User size={20} />}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-bold">{chatPartner?.name || "Chat"}</h3>
                  <p className="text-xs text-gray-500">
                    {onlineUsers.includes(String(chatPartner?._id)) ? (
                      <span className="text-green-500">● Online</span>
                    ) : (
                      chatPartner?.email || ""
                    )}
                  </p>
                </div>
              </div>

              {/* Drag overlay */}
              {isDragOver && (
                <div className="absolute inset-0 bg-yellow-50 bg-opacity-90 flex items-center justify-center z-10 pointer-events-none">
                  <div className="text-yellow-600 text-center">
                    <Paperclip size={48} className="mx-auto mb-2" />
                    <p className="text-lg font-medium">Drop image here to send</p>
                  </div>
                </div>
              )}

              {/* Messages Container */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 bg-gray-50"
              >
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                      <MessageSquare size={48} className="mb-2 opacity-30" />
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((msg, i) => {
                      const senderId =
                        typeof msg.sender === "string" ? msg.sender : msg.sender._id;

                      const isOwnMessage = senderId === (user?.userId || user?.id);

                      const previousSender = messages[i - 1]?.sender;
                      const previousSenderId =
                        typeof previousSender === "string"
                          ? previousSender
                          : previousSender?._id;

                      const showAvatar = i === 0 || previousSenderId !== senderId;

                      return (
                        <div
                          key={msg._id}
                          className={`flex ${
                            isOwnMessage ? "justify-end" : "justify-start"
                          }`}
                        >
                          {!isOwnMessage && showAvatar && (
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage
                                src={chatPartner?.profileImage}
                                alt={chatPartner?.name}
                              />
                              <AvatarFallback className="bg-gray-100">
                                {chatPartner?.name?.charAt(0) || (
                                  <User size={16} />
                                )}
                              </AvatarFallback>
                            </Avatar>
                          )}

                          <div
                            className={`flex flex-col ${
                              !isOwnMessage && !showAvatar ? "ml-10" : ""
                            }`}
                          >
                            {renderMessageContent(msg, isOwnMessage)}
                            <div
                              className={`text-xs text-gray-500 mt-1 ${
                                isOwnMessage ? "text-right" : "text-left"
                              }`}
                            >
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
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
                  {/* Move messagesEndRef outside the map and at the end */}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="p-2 border-t bg-gray-50">
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Upload preview"
                      className="h-20 rounded"
                    />
                    <button
                      onClick={handleCancelUpload}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              )}

              {showEmojiPicker && (
                <div 
                  className="emoji-picker-container fixed z-50"
                  style={{
                    top: `${emojiPickerPosition.top}px`,
                    left: `${emojiPickerPosition.left}px`
                  }}
                >
                  <EmojiPicker 
                    onEmojiClick={handleEmojiClick}
                    width={300}
                    height={350}
                    searchDisabled={false}
                    skinTonesDisabled={false}
                    previewConfig={{
                      showPreview: false
                    }}
                  />
                </div>
              )}

              {/* Message Input */}
             <form
                onSubmit={handleSendMessage}
                className="p-3 border-t bg-white flex items-center gap-2"
              >
                {/* File Upload Button */}
                <label className="cursor-pointer text-gray-500 hover:text-yellow-600 transition-colors">
                  <Paperclip size={20} />
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>

                {/* Emoji Button */}
                <Button
                  ref={emojiButtonRef}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="p-2 text-gray-500 hover:text-yellow-600 transition-colors"
                  onClick={handleEmojiButtonClick}
                >
                  <Smile size={20} />
                </Button>

                {/* Message Input */}
                <Input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 rounded-full border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />

                {/* Send Button */}
                <Button
                  type="submit"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-full w-10 h-10 p-0 flex items-center justify-center transition-colors"
                  disabled={sending || (!messageText.trim() && !selectedFile)}
                >
                  {sending ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <Send size={18} />
                  )}
                </Button>
              </form>
            

{/* Emoji Picker Overlay - place this right after the form, before closing the chat container div */}
{showEmojiPicker && (
  <>
    {/* Background overlay to close picker */}
    <div 
      className="fixed inset-0 z-40"
      onClick={() => setShowEmojiPicker(false)}
    />
    
    {/* Emoji Picker */}
    <div 
      className="fixed z-50 shadow-lg rounded-lg overflow-hidden"
      style={{
        top: `${emojiPickerPosition.top}px`,
        left: `${emojiPickerPosition.left}px`,
        maxWidth: '300px'
      }}
    >
      <EmojiPicker 
        onEmojiClick={handleEmojiClick}
        width={300}
        height={350}
        searchDisabled={false}
        skinTonesDisabled={false}
        previewConfig={{
          showPreview: false
        }}
      />
    </div>
  </>
)}
            </div>

            {/* Property Info */}
            {/* Property Info */}
          <div
              className={`
                ${
                  isMobileInfoVisible
                    ? "absolute z-10 top-16 left-0 right-0 bg-white p-4 shadow-xl rounded-lg m-2"
                    : "hidden md:block"
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
                      className="w-full h-32 object-cover"
                    />
                  ) : (
                    <div className="w-full h-32 bg-gray-200 flex items-center justify-center">
                      <Home size={32} className="text-gray-400" />
                    </div>
                  )}

                  <CardContent className="pt-3">
                    <h3 className="text-lg font-bold text-gray-800 mb-2 flex items-center justify-between">
                      <span>{property?.title}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-1 text-yellow-600"
                      >
                        <Star size={16} />
                      </Button>
                    </h3>

                    {property?.rentPerMonth && (
                      <div className="flex items-center mb-3">
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-bold">
                          ₹{property.rentPerMonth}/month
                        </span>
                      </div>
                    )}

                    {(property?.bedrooms || property?.bathrooms) && (
                      <div className="flex justify-start gap-4 mb-3 bg-gray-50 p-2 rounded-lg">
                        {property.bedrooms && (
                          <div className="flex items-center">
                            <span className="text-gray-700 font-medium text-sm">
                              {property.bedrooms}
                            </span>
                            <span className="text-gray-600 ml-1 text-sm">Bed</span>
                          </div>
                        )}
                        {property.bathrooms && (
                          <div className="flex items-center">
                            <span className="text-gray-700 font-medium text-sm">
                              {property.bathrooms}
                            </span>
                            <span className="text-gray-600 ml-1 text-sm">Bath</span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mb-3">
                      <h4 className="font-semibold text-gray-800 mb-1 text-sm">
                        Description
                      </h4>
                      <p className="text-gray-600 text-xs">
                        {property?.description 
                          ? property.description.length > 80 
                            ? `${property.description.substring(0, 80)}...`
                            : property.description
                          : ''
                        }
                      </p>
                    </div>

                    {property?.features && property.features.length > 0 && (
                      <div className="mb-3">
                        <h4 className="font-semibold text-gray-800 mb-1 text-sm">
                          Amenities
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {property.features.slice(0, 4).map((amenity, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                            >
                              {amenity}
                            </span>
                          ))}
                          {property.features.length > 4 && (
                            <span className="text-gray-500 text-xs px-2 py-1">
                              +{property.features.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {chatPartner && (
                      <div className="mt-4 pt-3 border-t">
                        <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                          Owner
                        </h4>
                        <div className="flex items-center bg-yellow-50 p-2 rounded-lg">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage
                              src={chatPartner.profileImage}
                              alt={chatPartner.name}
                            />
                            <AvatarFallback className="bg-yellow-100 text-yellow-800">
                              {chatPartner.name.charAt(0) || <User size={16} />}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h5 className="font-medium text-sm">{chatPartner.name}</h5>
                            <p className="text-xs text-gray-500">
                              {chatPartner.email}
                            </p>
                             <p className="text-xs text-gray-500 pt-1">
                              {chatPartner.phone}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-yellow-500 text-yellow-600 hover:bg-yellow-50 text-xs"
                        onClick={() =>
                          navigate(`/user/property/${property?._id || ""}`)
                        }
                      >
                        View Full Details
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ChatPage;
