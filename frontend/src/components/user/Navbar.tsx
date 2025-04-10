import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthStore } from "../../stores/authStore";
import { notifySuccess } from "../../utils/notifications";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const userMenuRef = useRef(null);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    const handleClickOutside = (event:any) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      notifySuccess("Logged out successfully!");
      navigate("/");
      setUserMenuOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Navigation items
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Houses", path: "/user/properties" },
    { name: "Categories", path: "/categories" },
    { name: "About", path: "/about" }
  ];

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.6, 0.05, 0.01, 0.9] }}
      className={`fixed w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? "py-3 bg-white shadow-lg" 
          : "py-5 bg-white/95 backdrop-blur-lg"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span className="text-2xl font-bold text-yellow-600">Stayora</span>
          </motion.div>
        </Link>

        {/* Desktop Menu - Centered */}
        <div className="hidden md:flex items-center justify-center space-x-10 absolute left-1/2 transform -translate-x-1/2">
          {navItems.map((item) => (
            <Link 
              key={item.name}
              to={item.path}
              className="relative group py-2 font-medium text-gray-800 transition-colors duration-300 hover:text-yellow-600"
            >
              {item.name}
              <motion.div 
                className="absolute bottom-0 left-0 h-0.5 bg-yellow-600 rounded-full"
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
              {location.pathname === item.path && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute -bottom-0 left-0 h-0.5 w-full bg-yellow-600 rounded-full"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Auth Buttons / User Menu */}
        <div className="flex items-center">
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <motion.button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center space-x-2 pl-2 pr-4 py-1.5 rounded-full bg-white border border-yellow-200 hover:bg-yellow-50 transition-colors duration-300"
              >
                <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center text-white font-medium shadow-sm">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="text-gray-800 font-medium hidden sm:block">
                  {user?.name?.split(' ')[0] || "User"}
                </span>
              </motion.button>
              
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-yellow-100 py-1.5 z-50 overflow-hidden"
                  >
                    <div className="px-4 py-2 border-b border-yellow-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name || "User"}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email || "user@example.com"}</p>
                    </div>
                    
                    {[
                      { label: "Profile", path: "/user/profile" },
                      { label: "My Bookings", path: "/user/bookings" },
                      { label: "Favorites", path: "/favorites" }
                    ].map((item, index) => (
                      <motion.div
                        key={item.label}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Link 
                          to={item.path}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors duration-150"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}
                    
                    <div className="border-t border-yellow-100 mt-1"></div>
                    <motion.div
                      initial={{ x: -10, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.15 }}
                    >
                      <button 
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition-colors duration-150"
                      >
                        Logout
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/login" 
                className="bg-yellow-600 text-white px-6 py-2 rounded-full font-medium shadow-sm hover:bg-yellow-700 transition-all duration-300 whitespace-nowrap"
              >
                Sign In
              </Link>
            </motion.div>
          )}

          {/* Mobile Menu Button */}
          <button 
            className="ml-4 md:hidden p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-7 flex flex-col items-end justify-center">
              <motion.span 
                className="w-7 h-0.5 bg-yellow-600 block mb-1.5"
                animate={mobileMenuOpen ? 
                  { rotate: 45, y: 6, width: "100%" } : 
                  { rotate: 0, y: 0, width: "100%" }
                }
                transition={{ duration: 0.3 }}
              />
              <motion.span 
                className="h-0.5 bg-yellow-600 block mb-1.5"
                initial={{ width: "70%" }}
                animate={mobileMenuOpen ? 
                  { width: 0, opacity: 0 } : 
                  { width: "70%", opacity: 1 }
                }
                transition={{ duration: 0.3 }}
              />
              <motion.span 
                className="h-0.5 bg-yellow-600 block"
                initial={{ width: "40%" }}
                animate={mobileMenuOpen ? 
                  { width: "100%", rotate: -45, y: -6 } : 
                  { width: "40%", rotate: 0, y: 0 }
                }
                transition={{ duration: 0.3 }}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.6, 0.05, 0.01, 0.9] }}
            className="md:hidden overflow-hidden bg-white px-6 pb-5 shadow-inner"
          >
            <div className="pt-2 space-y-1">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    to={item.path}
                    className="flex items-center py-3 text-gray-800 font-medium border-b border-gray-100"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-yellow-600 mr-3 opacity-80">0{index + 1}</span>
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </div>
            
            {isAuthenticated ? (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-4 space-y-2 bg-yellow-50 p-4 rounded-lg"
              >
                <div className="flex items-center space-x-3 pb-3 border-b border-yellow-200/30">
                  <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center text-white font-medium">
                    {user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{user?.name || "User"}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || "user@example.com"}</p>
                  </div>
                </div>
                
                {[
                  { label: "Profile", path: "/profile" },
                  { label: "My Bookings", path: "/bookings" },
                  { label: "Favorites", path: "/favorites" }
                ].map((item, index) => (
                  <Link 
                    key={item.label}
                    to={item.path}
                    className="block py-2 text-gray-700 hover:text-yellow-600 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                
                <button
                  onClick={handleLogout}
                  className="mt-2 w-full bg-yellow-600 py-2.5 rounded-md text-white font-medium shadow-sm hover:bg-yellow-700 transition-colors duration-300"
                >
                  Logout
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-6 flex space-x-3"
              >
                <Link 
                  to="/login"
                  className="w-1/2 bg-yellow-600 text-white py-3 rounded-lg font-medium text-center shadow-sm hover:bg-yellow-700 transition-colors duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/register"
                  className="w-1/2 bg-white text-yellow-600 border border-yellow-200 py-3 rounded-lg font-medium text-center hover:bg-yellow-50 transition-colors duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;