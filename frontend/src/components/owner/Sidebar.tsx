import { useState } from "react";
import { Home, User, Settings, LogOut, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { notifyError, notifySuccess } from "../../utils/notifications";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated, user, authType, logout } = useAuthStore();
  console.log(user, isAuthenticated, authType);
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      await logout();
      notifySuccess("Logged out successfully!");
      navigate("/owner/login");
    } catch (err: any) {
      console.error("Logout error:", err);
      notifyError(
        err.response?.data?.error || "Failed to logout. Please try again."
      );
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: isOpen ? "250px" : "80px" }}
        className="h-screen bg-[#A98E60] text-white p-4 flex flex-col relative"
      >
        {/* Toggle Button */}
        <button
          className="absolute top-4 right-4 text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu size={24} />
        </button>

        {/* Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mt-10"
        >
          <img
            src="https://static.vecteezy.com/system/resources/previews/020/213/738/original/add-profile-picture-icon-upload-photo-of-social-media-user-vector.jpg"
            alt="Owner"
            className="w-16 h-16 rounded-full border-2 border-white"
          />
          {isOpen && (
            <div className="mt-2 text-center">
              <p className="text-sm font-bold">
                {isAuthenticated ? user?.name || "John Doe" : "Guest"}
              </p>
              {isAuthenticated && (
                <p className="text-xs text-yellow-200">{user?.email}</p>
              )}
            </div>
          )}
        </motion.div>

        {/* Navigation Links */}
        <nav className="mt-10 flex flex-col gap-4">
          <NavItem
            icon={<Home />}
            text="Dashboard"
            path="/owner/dashboard"
            isOpen={isOpen}
          />
          <NavItem
            icon={<User />}
            text="Profile"
            path="/owner/profile"
            isOpen={isOpen}
          />
          <NavItem
            icon={<Settings />}
            text="Settings"
            path="/settings"
            isOpen={isOpen}
          />
          <NavItem
            icon={<LogOut />}
            text="Logout"
            isOpen={isOpen}
            onClick={handleLogout}
          />
        </nav>
      </motion.aside>
    </div>
  );
};

const NavItem = ({ icon, text, path, isOpen, onClick }: any) => {
  return (
    <Link
      to={path}
      onClick={onClick} 
      className="flex items-center gap-2 p-2 hover:bg-gray-500 rounded-md"
    >
      {icon}
      {isOpen && <span>{text}</span>}
    </Link>
  );
};

export default Sidebar;
