// NotificationsPage.tsx
import { useEffect, useState, useRef } from "react";
import { Check, Home, Calendar, Bell, Loader2, Trash2 } from "lucide-react";
import moment from "moment";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import UserLayout from "../../components/user/UserLayout";
import { INotification } from "../../types/notification";

export default function NotificationsPage() {
  const { getNotifications, markNotificationAsRead,deleteNotification  } = useAuthStore();

  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);

  // Loading states
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const [loadingAll, setLoadingAll] = useState(false);
  const [deletingIds, setDeletingIds] = useState<string[]>([]);
const [loading, setLoading] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
              setLoading(true); 

        const res = await getNotifications();
        setNotifications(res.data);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }finally{
              setLoading(false); 

      }
    };
    fetchNotifications();
  }, [getNotifications]);

  const markAsRead = async (id: string) => {
    try {
      setLoadingIds((ids) => [...ids, id]);
      await markNotificationAsRead(id);
      
      // Update local state immediately for better UX
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      
      window.dispatchEvent(new CustomEvent('notificationRead'));
      
    } catch (err) {
      console.error("Failed to mark as read", err);
    } finally {
      setLoadingIds((ids) => ids.filter((loadingId) => loadingId !== id));
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.read);
    if (unreadNotifications.length === 0) return;

    setLoadingAll(true);
    try {
      const promises = unreadNotifications.map((notif) => 
        markNotificationAsRead(notif._id)
      );
      
      await Promise.all(promises);
      
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
      
      window.dispatchEvent(new CustomEvent('notificationRead'));
      
    } catch (err) {
      console.error("Failed to mark all as read", err);
    } finally {
      setLoadingAll(false);
    }
  };

  const removeNotification = async (id: string) => {
    try {
      console.log(id)
      setDeletingIds((ids) => [...ids, id]);
      
      if (deleteNotification) {
        await deleteNotification(id);
      }
    
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      
      window.dispatchEvent(new CustomEvent('notificationRead'));
      
    } catch (err) {
      console.error("Failed to delete notification", err);
    } finally {
      setDeletingIds((ids) => ids.filter((deletingId) => deletingId !== id));
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getIcon = (type: string) => {
    switch (type) {
      case "booking":
        return <Home size={20} className="text-green-500" />;
      case "reminder":
        return <Calendar size={20} className="text-blue-500" />;
      default:
        return <Bell size={20} className="text-yellow-500" />;
    }
  };

  const getNotificationTitle = (notif: INotification) => {
    switch (notif.type) {
      case "booking":
        return "Booking Confirmed";
      case "reminder":
        return "Reminder";
      case "payment":
        return "Payment Update";
      case "system":
        return "System Notification";
      default:
        return "Notification";
    }
  };
if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-t-2 border-golden rounded-full"></div>
      </div>
    );
  }
  return (
    <UserLayout>
      <div className="min-h-screen bg-gradient-to-b from-white to-[#f9f7f1] px-6 py-12 flex justify-center items-start">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col border border-[#c9a46c33]">
          {/* Header */}
          <header className="flex items-center justify-between px-12 py-6 bg-[#c9a46c] border-b-2 border-[#c9a46c66]">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-serif font-semibold text-white">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="bg-yellow-400 text-[#c9a46c] text-sm font-bold px-3 py-1 rounded-full shadow-sm">
                  {unreadCount} unread
                </span>
              )}
            </div>

            <button
              onClick={markAllAsRead}
              disabled={unreadCount === 0 || loadingAll}
              aria-label="Mark all notifications as read"
              className={`flex items-center gap-2 font-semibold text-base transition duration-200 rounded-lg px-5 py-2 ${
                unreadCount > 0 && !loadingAll
                  ? "bg-white text-[#c9a46c] hover:bg-[#f5f5f5] hover:shadow-md transform hover:scale-105"
                  : "bg-white/50 text-[#c9a46c80] cursor-not-allowed"
              } ${loadingAll ? "opacity-70 cursor-wait" : ""}`}
            >
              {loadingAll ? (
                <Loader2 size={20} className="animate-spin text-[#c9a46c]" />
              ) : (
                <Check size={20} />
              )}
              Mark all as read
            </button>
          </header>

          {/* Notification List */}
          <div
            ref={containerRef}
            className="flex-1 overflow-y-auto max-h-[70vh] divide-y divide-[#c9a46c44]"
            style={{ backgroundColor: "#fcfbf7" }}
          >
            {notifications.length === 0  ? (
              <div className="flex flex-col items-center justify-center py-28 text-[#c9a46c99] select-none">
                <Bell size={56} className="opacity-50" />
                <p className="mt-4 text-xl font-light italic tracking-wide">
                  No notifications available
                </p>
                <p className="mt-2 text-sm text-[#c9a46c77]">
                  You're all caught up!
                </p>
              </div>
            ) : (
              notifications.slice(0, visibleCount).map((notif, index) => (
                <div
                  key={notif._id}
                  className={`flex items-start gap-4 px-6 py-5 transition-all duration-300 hover:shadow-md ${
                    !notif.read
                      ? "bg-gradient-to-r from-[#fefceb] to-[#fdf9e3] border-l-4 border-l-[#c9a46c] shadow-sm"
                      : "bg-white hover:bg-[#f9f9f9]"
                  } ${index === 0 ? "rounded-t-lg" : ""}`}
                  role="listitem"
                >
                  {/* Unread indicator dot */}
                  {!notif.read && (
                    <div className="w-3 h-3 bg-[#c9a46c] rounded-full mt-2 animate-pulse"></div>
                  )}

                  {/* Icon */}
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-xl transition-colors duration-200 ${
                      !notif.read
                        ? "bg-[#f5f1d1] border border-[#c9a46c44]"
                        : "bg-[#f0f0f0]"
                    }`}
                    aria-hidden="true"
                  >
                    {getIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-serif text-lg font-semibold truncate transition-colors duration-200 ${
                        !notif.read ? "text-[#4a3c1a]" : "text-[#6b6b6b]"
                      }`}
                    >
                      {notif.type === "booking" && notif.otherId ? (
                        <Link
                          to={`/user/bookings/${notif.otherId}`}
                          className="hover:underline text-[#c9a46c] hover:text-[#b18f56] transition-colors duration-200"
                          title={getNotificationTitle(notif)}
                        >
                          {getNotificationTitle(notif)}
                        </Link>
                      ) : (
                        getNotificationTitle(notif)
                      )}
                    </h3>
                    <p className={`text-sm mt-1 leading-relaxed transition-colors duration-200 ${
                      !notif.read ? "text-[#5a5134]" : "text-[#888888]"
                    }`}>
                      {notif.message}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <time
                        dateTime={notif.createdAt}
                        className="text-xs text-[#a9925d] font-light"
                      >
                        {moment(notif.createdAt).fromNow()}
                      </time>
                      {!notif.read && (
                        <span className="text-xs bg-[#c9a46c] text-white px-2 py-1 rounded-full font-medium">
                          New
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 ml-3">
                    {!notif.read && (
                      <button
                        onClick={() => markAsRead(notif._id)}
                        disabled={loadingIds.includes(notif._id)}
                        title="Mark as read"
                        aria-label={`Mark notification ${notif._id} as read`}
                        className="p-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed bg-[#f2ecc4] hover:bg-[#e8e088] text-[#7c6e3b]"
                      >
                        {loadingIds.includes(notif._id) ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Check size={18} />
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => removeNotification(notif._id)}
                      disabled={deletingIds.includes(notif._id)}
                      title="Delete notification"
                      aria-label={`Delete notification ${notif._id}`}
                      className="p-2 rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed bg-[#ffeaea] hover:bg-[#ffcccc] text-[#cc4444]"
                    >
                      {deletingIds.includes(notif._id) ? (
                        <Loader2 size={18} className="animate-spin" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Show More Button */}
          {visibleCount < notifications.length && (
            <div className="border-t border-[#c9a46c44] py-5 px-10 flex justify-center bg-gradient-to-r from-[#f7f2e9] to-[#f5f0e6]">
              <button
                onClick={() => setVisibleCount((v) => v + 6)}
                className="font-semibold text-[#c9a46c] hover:text-[#b18f56] transition-all duration-200 hover:scale-105 px-4 py-2 rounded-lg hover:bg-white hover:shadow-md"
              >
                View more notifications ({notifications.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}