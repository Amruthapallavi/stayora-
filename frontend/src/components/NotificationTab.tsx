import { useState, useEffect, useRef, ReactNode } from 'react';
import {
  Bell,
  X,
  Check,
  ChevronRight,
  Calendar,
  Home,
  MessageSquare,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import moment from 'moment'; 
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
export interface DisplayNotification {
    _id: string;
    title: string;
    type:string;
    otherId:string |null;
    description: string;
    time: string;
    read: boolean;
    icon: ReactNode;
  }
  export interface RawNotification {
    _id: string;
    message: string;
    createdAt: string;
    read: boolean;
    recipient: string;
    recipientModel: string;
    type: 'booking' | 'message' | 'reminder' | string; 
    otherId: string;
    __v?: number;
  }
  interface NotificationsTabProps {
    notifications: RawNotification[];
  }
  
  const NotificationsTab: React.FC<NotificationsTabProps> = ({ notifications }) => {
    const [isOpen, setIsOpen] = useState(false);
  const [notifList, setNotifList] = useState<DisplayNotification[]>([]);
const navigate=useNavigate();
const {markNotificationAsRead}=useAuthStore();
  const notificationRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event:any) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
console.log(notifList)
//   const markAsRead = (id:any) => {
//     setNotifList((prev) =>
//       prev.map((notif) =>
//         notif.id === id ? { ...notif, read: true } : notif
//       )
//     );
//   };
useEffect(() => {
    const transformed = notifications.map((n) => ({
      id: n._id,
      title: n.type === 'booking' ? 'Booking Confirmed' : 'Notification',
      description: n.message,
      time: moment(n.createdAt).fromNow(),
      read: n.read,
      icon:
        n.type === 'booking' ? (
          <Home size={16} className="text-green-500" />
        ) : (
          <Calendar size={16} className="text-blue-500" />
        ),
    }));
    setNotifList(transformed);
  }, [notifications]);
  
  const markAsRead = async (id: string) => {
    console.log(id,"formark not")
    await markNotificationAsRead(id); 
    setNotifList((prev) =>
      prev.map((notif) =>
        notif._id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const removeNotification = (id:any) => {
    setNotifList((prev) => prev.filter((notif) => notif._id !== id));
  };

  const unreadNotifications = notifList.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={notificationRef}>
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full bg-white text-gray-600 hover:bg-yellow-50 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-md"
      >
        <Bell size={20} />
        {unreadNotifications > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-yellow-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
          >
            {unreadNotifications}
          </motion.span>
        )}
      </button>

      {/* Notifications Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-yellow-50 px-4 py-3 flex items-center justify-between border-b border-yellow-100">
              <h3 className="font-semibold text-gray-800">Notifications</h3>
              <div className="flex items-center gap-2">
                <button
onClick={async () => {
  for (const notif of notifList.filter((n) => !n.read)) {
    await markAsRead(notif._id);
  }
}}
                  className="text-xs text-yellow-600 hover:text-yellow-800 transition flex items-center"
                >
                  <Check size={14} className="mr-1" />
                  Mark all read
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifList.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell size={32} className="mx-auto mb-2 opacity-30" />
                  <p>No notifications</p>
                </div>
              ) : (
                <ul>
                  <AnimatePresence>
                    {notifList.map((notification) => (
                      <motion.li
                        key={notification._id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        layout
                        className={`border-b border-gray-100 relative ${
                          !notification.read ? 'bg-yellow-50' : ''
                        }`}
                      >
                        <div className="p-4 pr-12">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 p-1 rounded-md bg-gray-100 mr-3">
                              {notification.icon}
                            </div>
                            <div>
                            <h4 className="font-medium text-gray-900">
            {notification.type === 'booking' && notification.otherId ? (
              <Link to={`/user/bookings/${notification.otherId}`} className="cursor-pointer hover:underline">
                {notification.title}
              </Link>
            ) : (
              notification.title
            )}
          </h4>

                              <p className="text-sm text-gray-600">
                                {notification.description}
                              </p>
                              <span className="text-xs text-gray-500 mt-1 block">
                                {notification.time}
                              </span>
                            </div>
                          </div>

                          <div className="absolute top-3 right-3 flex">
                          {!notification.read && (
  <button
    onClick={() => markAsRead(notification.id)} 
    className="text-gray-400 hover:text-yellow-600 p-1 transition"
    title="Mark as read"
  >
    <Check size={16} />
  </button>
)}

                            <button
                              onClick={() => removeNotification(notification.id)}
                              className="text-gray-400 hover:text-red-600 p-1 transition"
                              title="Remove"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-gray-50 border-t border-gray-100">
              <button className="text-sm text-center w-full text-yellow-600 hover:text-yellow-800 transition flex items-center justify-center">
                View all notifications
                <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationsTab;
