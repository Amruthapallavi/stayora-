// components/Notification.tsx
import React from "react";

interface NotificationProps {
  message: string;
  isVisible: boolean;
}

const Notification: React.FC<NotificationProps> = ({ message, isVisible }) => {
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 px-4 py-2 rounded-md shadow-md text-white bg-[#4BB543] text-sm transition-all duration-300 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      {message}
    </div>
  );
};

export default Notification;
