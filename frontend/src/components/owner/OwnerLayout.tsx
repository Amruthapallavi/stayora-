import { useState } from "react";
import Sidebar from "./Sidebar";

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 p-6 w-full`}
        style={{
          marginLeft: isOpen ? "250px" : "80px", // Match sidebar width
        }}
      >
        {children}
      </div>
    </div>
  );
}
