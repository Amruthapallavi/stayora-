import { useState } from "react";
import Sidebar from "../../components/admin/Sidebar";
const AdminDashboard = () => {


  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar/>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-3xl font-semibold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Total Users */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-medium">Total Users</h2>
            <p className="text-3xl font-bold mt-4">1,245</p>
          </div>

          {/* Card 2: Total Vendors */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-medium">Total Vendors</h2>
            <p className="text-3xl font-bold mt-4">128</p>
          </div>

          {/* Card 3: Total Properties */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-lg font-medium">Total Properties</h2>
            <p className="text-3xl font-bold mt-4">482</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
