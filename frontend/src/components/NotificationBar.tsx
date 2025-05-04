import { useEffect, useState, useRef } from "react";
 import { Bell } from "lucide-react";
 import { format } from "date-fns";
 import { useAuthStore } from "../stores/authStore";
 
 interface Notification {
   _id: string;
   message: string;
   read: boolean;
   createdAt: string;
   type: string;
   entityId?: string;
 }
 
 interface NotificationDropdownProps {
   onNavigate?: (path: string) => void;
 }
 
 const NotificationCard = ({ onNavigate }: NotificationDropdownProps) => {
   const { getNotifications, markNotificationAsRead, authType } = useAuthStore();
   const [notifications, setNotifications] = useState<Notification[]>([]);
   const [isOpen, setIsOpen] = useState(false);
   const [loading, setLoading] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);
 
   const fetchNotifications = async () => {
     try {
       setLoading(true);
       const response = await getNotifications();
       console.log(response,"of notifications")
       if (response && response.data) {
         setNotifications(response.data);
       }
     } catch (error) {
       console.error("Error fetching notifications:", error);
     } finally {
       setLoading(false);
     }
   };
 
   useEffect(() => {
     if (isOpen) {
       fetchNotifications();
     }
   }, [isOpen]);
 
   useEffect(() => {
     const handleClickOutside = (event: MouseEvent) => {
       if (
         dropdownRef.current &&
         !dropdownRef.current.contains(event.target as Node)
       ) {
         setIsOpen(false);
       }
     };
 
     document.addEventListener("mousedown", handleClickOutside);
     return () => {
       document.removeEventListener("mousedown", handleClickOutside);
     };
   }, []);
 
   const handleMarkAsRead = async (notificationId: string) => {
     try {
       await markNotificationAsRead(notificationId);
       setNotifications(
         notifications.map((notification) =>
           notification._id === notificationId
             ? { ...notification, read: true }
             : notification
         )
       );
     } catch (error) {
       console.error("Error marking notification as read:", error);
     }
   };
 
   const handleMarkAllAsRead = async () => {
     try {
       setLoading(true);
       const unreadNotifications = notifications.filter((n) => !n.read);
 
       for (const notification of unreadNotifications) {
         await markNotificationAsRead(notification._id);
       }
 
       setNotifications(
         notifications.map((notification) => ({ ...notification, read: true }))
       );
     } catch (error) {
       console.error("Error marking all notifications as read:", error);
     } finally {
       setLoading(false);
     }
   };
 
   const handleNotificationClick = (notification: Notification) => {
     if (!notification.read) {
       handleMarkAsRead(notification._id);
     }
 
     if (notification.entityId && notification.type === "NEW_MESSAGE") {
       const basePath = authType === "owner" ? "/owner/chat/" : "/user/chat/";
       if (onNavigate) {
         onNavigate(`${basePath}${notification.entityId}`);
       }
       setIsOpen(false);
     }
   };
 
   const formatNotificationTime = (dateString: string) => {
     const notificationDate = new Date(dateString);
     const now = new Date();
     const diffInHours =
       (now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60);
 
     if (diffInHours < 24) {
       return format(notificationDate, "h:mm a");
     } else if (diffInHours < 7 * 24) {
       return format(notificationDate, "EEE");
     } else {
       return format(notificationDate, "MMM d");
     }
   };
 
   const unreadCount = notifications.filter(
     (notification) => !notification.read
   ).length;
 
   return (
     <div className="relative" ref={dropdownRef}>
       <button
         onClick={() => setIsOpen(!isOpen)}
         className="relative p-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
         aria-label="Notifications"
       >
         <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
         {unreadCount > 0 && (
           <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
             {unreadCount > 9 ? "9+" : unreadCount}
           </span>
         )}
       </button>
 
       {isOpen && (
         <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border border-gray-200 max-h-[80vh] flex flex-col">
           <div className="p-3 border-b border-gray-200 flex justify-between items-center">
             <h3 className="font-semibold text-gray-800">Notifications</h3>
             {unreadCount > 0 && (
               <button
                 onClick={handleMarkAllAsRead}
                 className="text-xs font-medium text-blue-600 hover:text-blue-800 cursor-pointer"
               >
                 Mark all as read
               </button>
             )}
           </div>
 
           <div className="overflow-y-auto" style={{ maxHeight: "60vh" }}>
             {loading ? (
               <div className="p-4 text-center text-gray-500">
                 Loading notifications...
               </div>
             ) : notifications.length === 0 ? (
               <div className="p-6 text-center text-gray-500">
                 <div className="mb-2">No notifications yet</div>
                 <div className="text-sm">
                   We'll notify you of important updates
                 </div>
               </div>
             ) : (
               notifications.map((notification) => (
                 <div
                   key={notification._id}
                   onClick={() => handleNotificationClick(notification)}
                   className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                     !notification.read ? "bg-blue-50" : ""
                   }`}
                 >
                   <div className="flex justify-between items-start">
                     <div className="flex-1 pr-4">
                       <p
                         className={`text-sm ${
                           !notification.read ? "font-medium" : "text-gray-700"
                         }`}
                       >
                         {notification.message}
                       </p>
                       <p className="text-xs text-gray-500 mt-1">
                         {formatNotificationTime(notification.createdAt)}
                       </p>
                     </div>
                     {!notification.read && (
                       <div className="w-2 h-2 bg-blue-600 rounded-full mt-1"></div>
                     )}
                   </div>
                 </div>
               ))
             )}
           </div>
 
           <div className="p-3 text-center border-t border-gray-200 mt-auto">
             <button
               onClick={() => setIsOpen(false)}
               className="text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
             >
               Close
             </button>
           </div>
         </div>
       )}
     </div>
   );
 };
 
 export default NotificationCard;