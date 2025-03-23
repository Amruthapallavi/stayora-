import { useState, useEffect } from "react";
import { Search, Eye, Ban, CheckCircle, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import Sidebar from "../../components/admin/Sidebar";
import { useAuthStore } from "../../stores/authStore";
import { notifyError, notifySuccess } from "../../utils/notifications";
import Swal from "sweetalert2";

type User = {
  _id:string;
  name: string;
  email: string;
  phone: string;
  status: "Active" | "Blocked";
  isVerified:boolean,
};

const AdminUsers = () => {
  const { listAllUsers , updateUserStatus } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem("theme") === "dark");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    loadUsers();
  }, [listAllUsers]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const response = await listAllUsers();
      setUsers(response.users);
    } catch (error) {
      console.error("Failed to load users:", error);
      notifyError("Failed to load users.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    console.log("User ID:", id, "Current Status:", currentStatus);
  
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to ${currentStatus === "Blocked" ? "Unblock" : "Block"} this user!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const newStatus = currentStatus === "Active" ? "Blocked" : "Active";
          console.log("New Status:", newStatus);
  
          const response = await updateUserStatus(id, newStatus);
          console.log("Response from updateUserStatus:", response);
  
          if (!response || response.error) {
            throw new Error(response?.message || "Failed to update status");
          }
  
          // Uncomment this if you want to update the UI manually
          // setUsers((prev) =>
          //   prev.map((user) =>
          //     user._id === id ? { ...user, status: newStatus } : user
          //   )
          // );
  
          notifySuccess(`User ${newStatus} successfully`);
          window.location.reload();
          console.log("Success notification should trigger");
  
        } catch (error) {
          console.error("Error updating status:", error);
          notifyError("Error updating user status");
        }
      }
    });
  };
  
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // const toggleDarkMode = () => {
  //   const newTheme = !darkMode;
  //   setDarkMode(newTheme);
  //   localStorage.setItem("theme", newTheme ? "dark" : "light");
  // };

  // Search Filtering
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery)
  );

    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.status === "Active").length;
    const blockedUsers = users.filter(user => user.status === "Blocked").length;
    const unverifiedUsers = users.filter(user => user.isVerified === false).length;
  
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className="flex transition-all max-h-screen">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 p-6 transition-all ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        {/* Summary Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-blue-500 text-white rounded-lg text-center shadow-md">
            <h2 className="text-lg font-semibold">Total Users</h2>
            <p className="text-2xl font-bold">{totalUsers}</p>
          </div>
          <div className="p-4 bg-green-500 text-white rounded-lg text-center shadow-md">
            <h2 className="text-lg font-semibold">Active Users</h2>
            <p className="text-2xl font-bold">{activeUsers}</p>
          </div>
          <div className="p-4 bg-red-500 text-white rounded-lg text-center shadow-md">
            <h2 className="text-lg font-semibold">Blocked Users</h2>
            <p className="text-2xl font-bold">{blockedUsers}</p>
          </div>
          <div className="p-4 bg-yellow-500 text-white rounded-lg text-center shadow-md">
            <h2 className="text-lg font-semibold">Unverified Users</h2>
            <p className="text-2xl font-bold">{unverifiedUsers}</p>
          </div>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800"> User Management</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search users..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* <button onClick={toggleDarkMode} className="p-2 bg-gray-200 rounded-lg">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button> */}
          </div>
        </div>

        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="w-full border-collapse bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-4">Username</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-100 text-gray-700">
                  <td className="p-4 font-semibold">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.phone}</td>
                  <td className={`p-4 font-semibold ${user.status === "Active" ? "text-green-600" : "text-red-600"}`}>{user.status}</td>
                  <td className="p-4 flex gap-3">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">View</button>
                    <button
                      className={`px-4 py-2 rounded-lg ${user.status === "Active" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"} text-white`}
                      onClick={() => toggleStatus(user._id,user.status)}
                    >
                      {user.status === "Active" ? "Block" : "Unblock"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-6">
          <button className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            Previous
          </button>
          <span className="text-gray-700 font-semibold">Page {currentPage} of {totalPages}</span>
          <button className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;




 