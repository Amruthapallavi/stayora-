import  { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="pt-[90px] px-4 sm:px-6 md:px-8 transition-all duration-300">
        {children}
      </main>
      <Footer/>
    </div>
  );
}
