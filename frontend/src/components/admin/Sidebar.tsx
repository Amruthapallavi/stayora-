import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Users,
  Building,
  Calendar,
  Settings,
  LogOut,
  PlusSquare,
  Menu,
} from "lucide-react";
import { motion } from "framer-motion";
import { notifyError, notifySuccess } from "../../utils/notifications";
import { useAuthStore } from "../../stores/authStore";

type SidebarProps = {
  isOpen: boolean;
  toggleSidebar: () => void;
};

const Sidebar: FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const {logout} = useAuthStore();
  const handleLogout = async () => {
    try {
      await logout();
      notifySuccess("Logged out successfully!");
      navigate("/admin/login");
      
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message || "Failed to logout. Please try again.";
      notifyError(errMsg);
    }
  };
  return (
    <motion.div
      animate={{ width: isOpen ? 250 : 80 }}
      className="h-screen bg-gray-900 text-white flex flex-col py-5 px-4 shadow-lg"
    >
      {/* Sidebar Toggle Button */}
      <div className="flex justify-between items-center">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleSidebar}
          className="text-white p-2 rounded-full bg-gray-700 hover:bg-gray-600"
        >
          <Menu size={24} />
        </motion.button>
      </div>

      {/* Sidebar Menu */}
      <nav className="mt-6 flex flex-col gap-4">
        {[
          { label: "Home", icon: Home, path: "/admin/dashboard" },
          { label: "Users", icon: Users, path: "/admin/users" },
          { label: "Owners", icon: Users, path: "/admin/owners" },
          { label: "Properties", icon: Building, path: "/admin/properties" },
          { label: "Bookings", icon: Calendar, path: "/admin/bookings" },
          { label: "Settings", icon: Settings, path: "/admin/settings" },
        ].map(({ label, icon: Icon, path }, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.1 }}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer"
            onClick={() => navigate(path)}
          >
            <Icon size={24} />
            {isOpen && <span>{label}</span>}
          </motion.div>
        ))}

        {/* Services & Features Dropdown */}
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer"
            onClick={() => setDropdownOpen(!isDropdownOpen)}
          >
            <PlusSquare size={24} />
            {isOpen && <span>Services & Features</span>}
          </motion.div>

          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="ml-6 mt-2 flex flex-col bg-gray-800 p-2 rounded-md"
            >
              {[
                { label: "Add Features", icon: PlusSquare, path: "/admin/features" },
                { label: "Add Services", icon: PlusSquare, path: "/admin/services" },
              ].map(({ label, icon: Icon, path }, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 cursor-pointer"
                  onClick={() => navigate(path)}
                >
                  <Icon size={20} />
                  {isOpen && <span>{label}</span>}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Logout */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-600 cursor-pointer mt-auto"
          onClick={handleLogout}
        >
          <LogOut size={24} />
          {isOpen && <span>Logout</span>}
        </motion.div>
      </nav>
    </motion.div>
  );
};

export default Sidebar;
