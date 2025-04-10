import { FC, ReactNode, useState } from "react";
import Sidebar from "./Sidebar";

type AdminLayoutProps = {
  children: ReactNode;
};

const AdminLayout: FC<AdminLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex h-screen">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 bg-gray-100 overflow-auto p-5">{children}</div>
    </div>
  );
};

export default AdminLayout;
