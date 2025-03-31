import { useState } from "react";
// import { Home, Users, Settings, BarChart, LogOut } from "lucide-react";
import Sidebar from "../../components/owner/Sidebar";
export default function OwnerDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      {/* Sidebar */}
      {/* <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-gray-900 text-white transition-all duration-300 flex flex-col p-4`}
      >
        <button
          className="mb-4 text-white text-xl"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          ☰
        </button>
        <nav className="flex flex-col gap-4">
          <SidebarItem icon={<Home />} text="Dashboard" isOpen={isSidebarOpen} />
          <SidebarItem icon={<Users />} text="Users" isOpen={isSidebarOpen} />
          <SidebarItem icon={<BarChart />} text="Analytics" isOpen={isSidebarOpen} />
          <SidebarItem icon={<Settings />} text="Settings" isOpen={isSidebarOpen} />
          <SidebarItem icon={<LogOut />} text="Logout" isOpen={isSidebarOpen} />
        </nav>
      </div> */}

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Owner Dashboard</h1>
        <p className="mt-2">Welcome to your admin dashboard.</p>
      </div>
    </div>
  );
}

function SidebarItem({ icon, text, isOpen }) {
  return (
    <div className="flex items-center gap-4 p-2 hover:bg-gray-700 rounded cursor-pointer">
      {icon}
      {isOpen && <span>{text}</span>}
    </div>
  );
}
