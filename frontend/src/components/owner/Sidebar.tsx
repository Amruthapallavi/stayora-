import { useState } from "react";
import { Home, User, Settings, LogOut, Menu, Building2, Plus, Calendar, Wallet, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { notifyError, notifySuccess } from "../../utils/notifications";

const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false); // Toggle for Properties sublist
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await logout();
      notifySuccess("Logged out successfully!");
      navigate("/owner/login");
    } catch (err: any) {
      notifyError(err.response?.data?.error || "Failed to logout. Please try again.");
    }
  };

  return (
    <div className="flex">
      <header className="flex justify-between items-center p-4 border-b">
  <h1 className="text-xl font-semibold">Tick-Track</h1>
  <div className="flex items-center gap-4">
    {/* Add other icons/menus if any */}
  </div>
</header>

      {/* Sidebar */}
      <motion.aside
  animate={{ width: isOpen ? "250px" : "80px" }}
  className="fixed top-0 left-0 h-screen bg-[#A98E60] text-white p-4 flex flex-col z-50"
>

        {/* Toggle Button */}
        <button
          className="absolute top-4 right-4 text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu size={24} />
        </button>

        {/* Profile Section */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center mt-10">
          <img
            src="https://static.vecteezy.com/system/resources/previews/020/213/738/original/add-profile-picture-icon-upload-photo-of-social-media-user-vector.jpg"
            alt="Owner"
            className="w-16 h-16 rounded-full border-2 border-white"
          />
          {isOpen && (
            <div className="mt-2 text-center">
              <p className="text-sm font-bold">{isAuthenticated ? user?.name || "John Doe" : "Guest"}</p>
              {isAuthenticated && <p className="text-xs text-yellow-200">{user?.email}</p>}
            </div>
          )}
        </motion.div>

        {/* Navigation Links */}
        <nav className="mt-10 flex flex-col gap-2">
          <NavItem icon={<Home />} text="Dashboard" path="/owner/dashboard" isOpen={isOpen} />
          <NavItem icon={<User />} text="Profile" path="/owner/profile" isOpen={isOpen} />
          
          {/* Properties (Expandable) */}
          <div>
            <button 
              onClick={() => setIsPropertiesOpen(!isPropertiesOpen)} 
              className="flex items-center gap-2 p-2 hover:bg-gray-500 rounded-md w-full"
            >
              <Building2 />
              {isOpen && <span>Properties</span>}
            </button>
            {isPropertiesOpen && (
              <div className="ml-4">
                <NavItem icon={<Plus />} text="Add Property" path="/owner/add-property" isOpen={isOpen} />
                <NavItem icon={<Building2 />} text="View Properties" path="/owner/properties" isOpen={isOpen} />
              </div>
            )}
          </div>

          {/* Bookings */}
          <NavItem icon={<Calendar />} text="Bookings" path="/owner/bookings" isOpen={isOpen} />
          <NavItem icon={<MessageCircle />} text="Chats & Notifications" path="/owner/chat" isOpen={isOpen} />

          {/* Settings & Logout */}
          <NavItem icon={<Wallet />} text="Wallet & Transactions" path="/owner/wallet" isOpen={isOpen} />

          <NavItem icon={<Settings />} text="Settings" path="/settings" isOpen={isOpen} />
          <NavItem icon={<LogOut />} text="Logout" isOpen={isOpen} onClick={handleLogout} />
        </nav>
      </motion.aside>
    </div>
  );
};

const NavItem = ({ icon, text, path, isOpen, onClick }: any) => {
  return (
    <Link to={path} onClick={onClick} className="flex items-center gap-2 p-2 hover:bg-gray-500 rounded-md">
      {icon}
      {isOpen && <span>{text}</span>}
    </Link>
  );
};

export default Sidebar;
