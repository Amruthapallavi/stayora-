import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "../../components/ui/scroll-area";
import { notifyError, notifySuccess } from "../../utils/notifications";
import { useAuthStore } from "../../stores/authStore";
import io from "socket.io-client";
import { Paperclip, Smile } from "lucide-react";
import EmojiPicker from 'emoji-picker-react';
import { 
  // ChatPartner,
   ConversationProps, Message } from "../../types/chat";


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
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Emoji functionality states
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiButtonRef = useRef<HTMLButtonElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const inputContainerRef = useRef<HTMLDivElement>(null);

  // Improved scroll to bottom function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: "smooth",
        block: "end"
      });
    }
  };

  // Alternative scroll method using scrollArea
  const scrollToBottomAlternative = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  };

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
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
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
      // Validate file size (optional - e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        notifyError("Image size should be less than 5MB");
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        notifyError("Please select a valid image file");
        return;
      }
      
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Cleanup image preview URL when component unmounts or image changes
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Improved emoji functionality
  const handleEmojiClick = (emojiObject: any) => {
    const emoji = emojiObject.emoji;
    setMessageText(prevText => prevText + emoji);
    setShowEmojiPicker(false);
    
    // Focus back on input after emoji selection
    setTimeout(() => {
      const input = document.querySelector('input[placeholder="Type your message..."]') as HTMLInputElement;
      if (input) {
        input.focus();
      }
    }, 100);
  };

  const handleEmojiButtonClick = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  // Close emoji picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showEmojiPicker && 
          !emojiButtonRef.current?.contains(event.target as Node) &&
          !emojiPickerRef.current?.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker]);

  // Handle window resize - close emoji picker
  useEffect(() => {
    const handleResize = () => {
      if (showEmojiPicker) {
        setShowEmojiPicker(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showEmojiPicker]);

  // Scroll to bottom when messages change
  useEffect(() => {
    // Use setTimeout to ensure DOM is updated
    setTimeout(() => {
      scrollToBottom();
      // Fallback method if first doesn't work
      setTimeout(() => {
        scrollToBottomAlternative();
      }, 100);
    }, 50);
  }, [messages]);

  // Initial scroll when conversation loads
  useEffect(() => {
    setMessages(conversation || []);
    setConversations(conversation || []); 
    
    // Scroll to bottom when conversation initially loads
    if (conversation && conversation.length > 0) {
      setTimeout(() => {
        scrollToBottom();
        setTimeout(() => {
          scrollToBottomAlternative();
        }, 100);
      }, 200);
    }
  }, [conversation]);

  useEffect(() => {
    const socketInstance = io("http://localhost:3000");
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() && !selectedFile) return;

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
        formData.append("image", selectedFile);
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

      // Cleanup preview URL
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      setMessageText("");
      setSelectedFile(null);
      setImagePreview(null);
      notifySuccess("Message sent");

      // Ensure scroll to bottom after sending message
      setTimeout(() => {
        scrollToBottom();
        setTimeout(() => {
          scrollToBottomAlternative();
        }, 100);
      }, 100);

    } catch (err) {
      console.error("Send error:", err);
      notifyError("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const removeImagePreview = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    setSelectedFile(null);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-[#b68451]/10 p-4">
        <h2 className="text-lg font-semibold text-[#b68451]">
          Chat with {partner.name || "Unknown"}
        </h2>
      </div>

      <ScrollArea 
        ref={scrollAreaRef}
        className="flex-1 p-4 max-h-[calc(100vh-20rem)] overflow-auto"
      >
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
                    <div className="mb-2">
                      <img
                        src={message.image}
                        alt="Sent"
                        className="max-w-full max-h-48 w-auto h-auto rounded-md object-cover cursor-pointer"
                        onClick={() => {
                          // Optional: Open image in modal or new tab
                          window.open(message.image, '_blank');
                        }}
                      />
                    </div>
                  )}

                  {message.content && <p className="break-words">{message.content}</p>}

                  <span className="text-[10px] opacity-70 mt-1 block text-right">
                    {formatChatTimestamp(message.timestamp)}
                  </span>
                </div>
              </div>
            );
          })}
          {/* Move messagesEndRef outside the map and at the end */}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="border-t border-[#b68451]/10 p-4">
        <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
          {/* Image preview */}
          {imagePreview && (
            <div className="relative inline-block">
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-[#b68451]/20">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImagePreview}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-md transition-colors"
                  aria-label="Remove image"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1 max-w-32 truncate">
                {selectedFile?.name}
              </p>
            </div>
          )}

          {/* Input container with relative positioning for emoji picker */}
          <div className="relative" ref={inputContainerRef}>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e);
                  }
                }}
                className="flex-1 px-4 py-2 rounded-full border border-[#b68451]/20 bg-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-[#b68451]/30 shadow-sm text-sm"
              />

              {/* Emoji Button */}
              <button
                ref={emojiButtonRef}
                type="button"
                onClick={handleEmojiButtonClick}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-[#b68451]/30 text-[#b68451] hover:bg-[#b68451]/10 transition duration-200"
                aria-label="Add emoji"
              >
                <Smile className="w-5 h-5" />
              </button>

              {/* File Upload */}
              <label className="flex items-center justify-center w-10 h-10 rounded-full border border-[#b68451]/30 text-[#b68451] hover:bg-[#b68451]/10 transition duration-200 cursor-pointer">
                <Paperclip className="w-5 h-5" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {/* Send Button */}
              <button
                type="submit"
                disabled={sending || (!messageText.trim() && !selectedFile)}
                className="px-5 py-2 rounded-full bg-[#b68451] text-white text-sm font-medium hover:bg-[#a2713d] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </div>

            {/* Emoji Picker - Properly positioned */}
            {showEmojiPicker && (
              <div 
                ref={emojiPickerRef}
                className="absolute bottom-full right-0 mb-2 z-50 shadow-2xl rounded-lg overflow-hidden border border-gray-200 bg-white"
                style={{
                  transform: 'translateX(-50px)' // Adjust horizontal position
                }}
              >
                <EmojiPicker 
                  onEmojiClick={handleEmojiClick}
                  width={320}
                  height={360}
                  searchDisabled={false}
                  skinTonesDisabled={false}
                  previewConfig={{ showPreview: false }}
                  lazyLoadEmojis={true}
                />
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Conversation;