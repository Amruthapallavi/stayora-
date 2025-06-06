import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "../../components/ui/scroll-area";
import { notifyError, notifySuccess } from "../../utils/notifications";
import { useAuthStore } from "../../stores/authStore";
import io from "socket.io-client";
import { IUser } from "../../types/user";
import { Paperclip } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  isOwner: boolean;
    image?: string; 

}

interface ConversationProps {
  conversation: any[];
  selectedConversation: string;
  propertyId: string;
  partner: IUser;
  onMessageSent?: (message: { content: string; timestamp: string }) => void;
}

const Conversation = ({
  conversation,
  selectedConversation,
  propertyId,
  partner,
  
}: ConversationProps) => {
  const { sendMessage, user } = useAuthStore();
  const [messageText, setMessageText] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [socket, setSocket] = useState<ReturnType<typeof io> | null>(null);
  const [_conversations, setConversations] = useState<any[]>([]);
  // const [showNotification, setShowNotification] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
const [selectedFile, setSelectedFile] = useState<File | null>(null);
const [imagePreview, setImagePreview] = useState<string | null>(null);

  const formatChatTimestamp = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } else if (isYesterday) {
      return "Yesterday";
    } else if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: "short", day: "numeric" }); // e.g., "Apr 23"
    } else {
      return date.toLocaleDateString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
      }); 
    }
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
  }
};

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    setMessages(conversation || []);
    setConversations(conversation || []); 
  }, [conversation]);

  useEffect(() => {
    const socketInstance = io("http://localhost:8000");
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!messageText.trim() && !selectedFile) return;

  // const newMessage = {
  //   id: uuidv4(),
  //   content: messageText,
  //   timestamp: new Date().toISOString(),
  //   sender: user.id,
  //   isOwner: true,
  //   image: imagePreview || undefined,
  // };

  try {
    setSending(true);
    const senderId = user.userId || user.id;
    const room = [senderId, selectedConversation].sort().join("-");

    const formData = new FormData();
    formData.append("sender", senderId);
    formData.append("senderModel", "User");
    formData.append("receiver", selectedConversation || "");
    formData.append("receiverModel", "Owner");
    formData.append("content", messageText);
    formData.append("room", room);
    formData.append("propertyId", propertyId);

    if (selectedFile) {
      formData.append("image", selectedFile); // ✅ image upload
    }

    const response = await sendMessage(formData);
    const newMessage = response.data;

    setMessages((prev) => [...prev, newMessage]);

    if (socket) {
      socket.emit("sendMessage", newMessage, room);
    }

    setConversations((prev) => {
      const updatedConversations = [...prev];
      const conversationIndex = updatedConversations.findIndex(
        (conv) => conv.partnerId === selectedConversation
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

    setMessageText("");
    setSelectedFile(null);
    setImagePreview(null);
    notifySuccess("Message sent");
  } catch (err) {
    console.error("Send error:", err);
    notifyError("Failed to send message");
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
            const isSentByUser =
              message.sender === user.userId || message.sender === user.id;

            return (
             <div
  key={message.id}
  className={`flex ${isSentByUser ? "justify-end" : "justify-start"}`}
>
  <div
    className={`relative max-w-[80%] px-4 py-3 rounded-2xl text-sm shadow-md animate-fade-in ${
      isSentByUser
        ? "bg-[#b68451] text-white rounded-br-none"
        : "bg-white border border-[#b68451]/10 text-gray-800 rounded-bl-none"
    }`}
  >
    {message.image && (
      <img
        src={message.image}
        alt="Sent"
        className="mb-2 max-w-full rounded-md object-cover"
      />
    )}

    {/* Text content (if any) */}
    {message.content && <p>{message.content}</p>}

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
     <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
  {/* Image preview */}
  {imagePreview && (
    <div className="relative w-fit">
      <img src={imagePreview} alt="Preview" className="max-h-40 rounded-lg" />
      <button
        type="button"
        onClick={() => {
          setImagePreview(null);
          setSelectedFile(null);
        }}
        className="absolute top-0 right-0 bg-black bg-opacity-50 text-white px-1 py-0.5 text-xs rounded-bl"
      >
        ✕
      </button>
    </div>
  )}

  {/* Input + send button */}
  <div className="flex items-center gap-3">
    <input
      type="text"
      placeholder="Type your message..."
      value={messageText}
      onChange={(e) => setMessageText(e.target.value)}
      className="flex-1 px-4 py-2 rounded-full border border-[#b68451]/20 bg-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#b68451]/30 shadow-sm text-sm"
    />

   <label className="flex items-center justify-center w-10 h-10 rounded-full border border-[#b68451]/30 text-[#b68451] hover:bg-[#b68451]/10 transition duration-200 cursor-pointer">
  <Paperclip className="w-5 h-5" />
  <input
    type="file"
    accept="image/*"
    onChange={handleImageChange}
    className="hidden"
  />
</label>


    <button
      type="submit"
      disabled={sending || (!messageText.trim() && !selectedFile)}
      className="px-5 py-2 rounded-full bg-[#b68451] text-white text-sm font-medium hover:bg-[#a2713d] disabled:opacity-50 transition-all"
    >
      Send
    </button>
  </div>
</form>

      </div>
    </div>
  );
};

export default Conversation;
