import { useEffect, useState } from "react";
import { Home, User, Settings, LogOut, Menu, Building2, Plus, Calendar, Wallet, MessageCircle, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { notifyError, notifySuccess } from "../../utils/notifications";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";

type NavItemProps = {
  icon: React.ReactNode;
  text: string;
  path: string;
  isOpen: boolean;
  onClick?: (e: React.MouseEvent) => void;
};

const NavItem = ({ icon, text, path, isOpen, onClick }: NavItemProps) => {
  return (
    <Link to={path} onClick={onClick} className="flex items-center gap-2 p-2 hover:bg-gray-500 rounded-md">
      {icon}
      {isOpen && <span>{text}</span>}
    </Link>
  );
};

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const navigate = useNavigate();
  const [isSubscribed, setIsSubscribed] = useState<boolean | null>(null);

  const { isAuthenticated, user, getUserData, logout } = useAuthStore();

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

useEffect(() => {
  if (!user) return;

  const fetchOwnerData = async () => {
    try {
      const response = await getUserData(user.id, "owner");
      if (response && response.user) {
        setIsSubscribed(response.user.isSubscribed);
      }
    } catch (error) {
      console.error("Failed to fetch owner data:", error);
    }
  };

  fetchOwnerData();
}, [user?.id]);

  return (
    <div className="flex">
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="text-xl font-semibold"></h1>
        <div className="flex items-center gap-4"></div>
      </header>

      <motion.aside
        animate={{ width: isOpen ? "250px" : "80px" }}
        className="fixed top-0 left-0 h-screen bg-[#A98E60] text-white p-4 flex flex-col z-50"
      >
        <button
          className="absolute top-4 right-4 text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu size={24} />
        </button>

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
              <p className="text-sm font-bold">{isAuthenticated ? user?.name || "John Doe" : "Guest"}</p>
              {isAuthenticated && <p className="text-xs text-yellow-200">{user?.email}</p>}
              
              {/* Subscription Status Badge */}
             {user && isSubscribed === false &&  (
                <Badge 
                  variant="outline" 
                  className="mt-2 bg-gradient-to-r from-rose-400 to-orange-300 text-white border-none animate-pulse"
                >
                  Unsubscribed
                </Badge>
              )}
            </div>
          )}
        </motion.div>

        <nav className="mt-10 flex flex-col gap-2 flex-grow">
          <NavItem icon={<Home />} text="Dashboard" path="/owner/dashboard" isOpen={isOpen} />
          <NavItem icon={<User />} text="Profile" path="/owner/profile" isOpen={isOpen} />
          
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

          <NavItem icon={<Calendar />} text="Bookings" path="/owner/bookings" isOpen={isOpen} />
          <NavItem icon={<MessageCircle />} text="Chats & Notifications" path="/owner/chat" isOpen={isOpen} />
          <NavItem icon={<Wallet />} text="Wallet & Transactions" path="/owner/wallet" isOpen={isOpen} />
          <NavItem icon={<Settings />} text="Settings" path="/settings" isOpen={isOpen} />
          <NavItem 
            icon={<LogOut />} 
            text="Logout" 
            path="/logout" 
            isOpen={isOpen} 
            onClick={handleLogout} 
          />
        </nav>

        {/* Subscribe Now Section */}
        {user && isSubscribed === false  && (
          <div className={`mt-auto mb-4 ${isOpen ? '' : 'flex justify-center'}`}>
            {isOpen ? (
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-3 rounded-lg shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-yellow-300" />
                  <span className="text-sm font-medium">Upgrade your account!</span>
                </div>
                <Link to="/owner/subscription">
                  <Button 
                    className="w-full bg-white hover:bg-white/90 text-purple-700 font-medium transition transform hover:scale-105"
                    size="sm"
                  >
                    Subscribe Now
                  </Button>
                </Link>
              </div>
            ) : (
              <Link to="/subscribe">
                <Button 
                  size="icon" 
                  className="bg-purple-600 hover:bg-purple-700 transition transform hover:scale-110"
                >
                  <Star className="h-4 w-4 text-yellow-300" />
                </Button>
              </Link>
            )}
          </div>
        )}
      </motion.aside>
    </div>
  );
};

export default Sidebar;
