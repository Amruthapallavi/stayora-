import { useEffect, useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
import { BarChart, Users, ShoppingBag, Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDarkMode = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");

    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6"
        >
          {[
            { label: "Users", count: "1,245", icon: Users, color: "text-blue-500" },
            { label: "Orders", count: "832", icon: ShoppingBag, color: "text-green-500" },
            { label: "Revenue", count: "$12,430", icon: BarChart, color: "text-purple-500" },
          ].map(({ label, count, icon: Icon, color }, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              className="p-4 bg-white dark:bg-gray-800 shadow-md rounded-xl flex items-center"
            >
              <Icon size={32} className={color} />
              <div className="ml-4">
                <h2 className="text-lg font-semibold">{label}</h2>
                <p className="text-gray-500 dark:text-gray-400">{count}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
