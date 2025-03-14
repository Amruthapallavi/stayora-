import { Menu, X } from "lucide-react";
import { useState } from "react";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div
      className={`${
        isSidebarOpen ? "w-64" : "w-20"
      } bg-black text-white p-4 transition-all duration-300`}
    >
      <button onClick={toggleSidebar} className="mb-6">
        {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      <nav className="space-y-4">
        <a href="#" className="block hover:text-gray-300">
          Dashboard
        </a>
        <a href="/admin/users" className="block hover:text-gray-300">
          Users
        </a>
        <a href="#" className="block hover:text-gray-300">
          Owners
        </a>
        <a href="#" className="block hover:text-gray-300">
          Properties
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;
