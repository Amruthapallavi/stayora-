import { MessageCircle } from "lucide-react";
import { ScrollArea } from "../../components/ui/scroll-area";
import { cn } from "../../lib/utils";
import { ConversationListProps } from "../../types/notification";



const ConversationList = ({
  onSelectConversation,
  selectedId,
  onlineUsers,
  conversations,

}: ConversationListProps) => {
  console.log(onlineUsers,"online users")
  return (
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
              {onlineUsers?.includes(conversation.partnerId) && (
                <div className="w-2 h-2 rounded-full bg-[#b68451] mt-2 animate-pulse" />
              )}


            </div>
            

          </button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default ConversationList;
