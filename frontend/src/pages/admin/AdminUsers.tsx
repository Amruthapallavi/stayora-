import { useState, useEffect } from "react";
import {
  Search,
  Eye,
  Ban,
  CheckCircle,
  //  Sun, Moon, ArrowRight, ArrowLeft
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthStore } from "../../stores/authStore";
import {
  notifyError,
  //  notifySuccess
} from "../../utils/notifications";
import Swal from "sweetalert2";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  showErrorAlert,
  showSuccessAlert,
} from "../../components/ConfirmationAlert";
import { IUser } from "../../types/user";
import Pagination from "../../components/admin/AdminPage";
import OwnerDetailsModal from "../../components/admin/OwnerDetailsModal";

const AdminUsers = () => {
  const { listAllUsers, updateUserStatus } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<IUser[]>([]);
  // const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem("theme") === "dark");
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isModal, setIsModal] = useState(false);

  const [totalUsers, setTotalUsers] = useState<IUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadUsers(currentPage, searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, currentPage]);

  const loadUsers = async (page = 1, search = "") => {
    setIsLoading(true);
    try {
      const response = await listAllUsers(page, limit, search || "");
      console.log(response, "users");
      setUsers(response.users);
      setTotalUsers(response.totalUsers ?? totalUsers);
      setTotalPages(response.totalPages ? response.totalPages : 1);
      if (response.currentPage !== undefined) {
        setCurrentPage(response.currentPage);
      } else {
        setCurrentPage(1);
      }
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
      text: `You are about to ${
        currentStatus === "Blocked" ? "Unblock" : "Block"
      } this user!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const newStatus = currentStatus === "Active" ? "Blocked" : "Active";
          console.log("New Status:", newStatus, id);

          const response = await updateUserStatus(id, newStatus);
          console.log("Response from updateUserStatus:", response);

          if (!response || response.error) {
            throw new Error(response?.message || "Failed to update status");
          }

          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === id ? { ...user, status: newStatus } : user
            )
          );

          // notifySuccess(`User ${newStatus} successfully`);
          showSuccessAlert(`User ${newStatus} successfully`);
          console.log("Success notification should trigger");
        } catch (error) {
          console.error("Error updating status:", error);
          showErrorAlert(`Error updating user status`);
          // notifyError("Error updating user status");
        }
      }
    });
  };
  const handleViewDetails = (user: IUser) => {
    setSelectedUser(user);
    setIsModal(true);
  };


  // const toggleDarkMode = () => {
  //   const newTheme = !darkMode;
  //   setDarkMode(newTheme);
  //   localStorage.setItem("theme", newTheme ? "dark" : "light");
  // };

  // Search Filtering
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery)
  );

  const usersCount = totalUsers.length;
  const activeUsers = totalUsers.filter(
    (user) => user.status === "Active"
  ).length;
  const blockedUsers = totalUsers.filter(
    (user) => user.status === "Blocked"
  ).length;
  const unverifiedUsers = totalUsers.filter(
    (user) => user.isVerified === false
  ).length;
  //  const indexOfLastUser = currentPage * limit;
  // const indexOfFirstUser = indexOfLastUser - limit;
  // const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-[#e0e7ff] to-[#fdf6f0] dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 font-sans">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-4xl font-extrabold text-gradient-primary bg-gradient-to-br from-purple-600 via-blue-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
              User Management Dashboard
            </h1>
            {/* <button 
            onClick={toggleDarkMode} 
            className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:scale-110 transition-all duration-200 border border-gray-200 dark:border-gray-600"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={22} className="text-yellow-400" /> : <Moon size={22} className="text-purple-500" />}
          </button> */}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
          >
            <StatCard
              title="Total Users"
              value={usersCount}
              bgColor="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
              icon={<Eye className="text-blue-600" size={30} />}
            />
            <StatCard
              title="Active Users"
              value={activeUsers}
              bgColor="linear-gradient(135deg, #c1dfc4 0%, #deecdd 100%)"
              icon={<CheckCircle className="text-green-500" size={30} />}
            />
            <StatCard
              title="Blocked Users"
              value={blockedUsers}
              bgColor="linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)"
              icon={<Ban className="text-red-500" size={30} />}
            />
            <StatCard
              title="Unverified Users"
              value={unverifiedUsers}
              bgColor="linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)"
              icon={
                <CheckCircle className="text-yellow-500 opacity-80" size={30} />
              }
            />
          </motion.div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl mb-8 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-gray-700 dark:text-white flex-shrink-0">
              Users List
            </h2>
            <div className="w-full sm:w-[340px]">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 w-full rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-gray-900/95 rounded-2xl shadow-2xl p-0 overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center p-16">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500"></div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto min-w-full">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:bg-gray-800/70 text-left">
                        <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-300 font-bold">
                          Username
                        </th>
                        <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-300 font-bold">
                          Email
                        </th>
                        <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-300 font-bold">
                          Phone
                        </th>
                        <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-300 font-bold">
                          Status
                        </th>
                        <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-300 font-bold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      <AnimatePresence>
                        {users.map((user) => (
                          <motion.tr
                            key={user.id}
                            className="transition-all hover:bg-blue-50 dark:hover:bg-gray-800 duration-150"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                          >
                            <td className="px-6 py-4 font-semibold text-md text-gray-900 dark:text-white flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-400 flex items-center justify-center text-base text-white font-bold shadow-lg">
                                {user.name[0]}
                              </div>
                              <div>{user.name}</div>
                            </td>
                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                              {user.email}
                            </td>
                            <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                              {user.phone}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold
                              ${
                                user.status === "Active"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              }`}
                              >
                                {user.status === "Active" ? (
                                  <CheckCircle
                                    size={14}
                                    className="text-green-400"
                                  />
                                ) : (
                                  <Ban size={14} className="text-red-400" />
                                )}
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                <button
                                  className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-400 to-purple-500 text-white rounded-lg font-medium shadow-sm hover:scale-105 focus:ring-2 focus:ring-blue-400 transition-all"
                                  onClick={() => handleViewDetails(user)}
                                >
                                  <Eye size={16} className="mr-1" /> View
                                </button>
                                <button
                                  className={`inline-flex items-center px-3 py-1 rounded-lg font-medium shadow-sm transition-all
                                  ${
                                    user.status === "Active"
                                      ? "bg-gradient-to-r from-red-400 to-red-600 hover:from-red-500 hover:to-red-700"
                                      : "bg-gradient-to-br from-green-400 to-green-600 hover:from-green-500 hover:to-green-700"
                                  }
                                  text-white focus:ring-2 focus:ring-offset-2 focus:ring-blue-400`}
                                  onClick={() =>
                                    toggleStatus(user.id, user.status)
                                  }
                                >
                                  {user.status === "Active" ? (
                                    <>
                                      <Ban size={15} className="mr-1" /> Block
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle size={15} className="mr-1" />{" "}
                                      Unblock
                                    </>
                                  )}
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>

                {filteredUsers.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-16 text-center">
                    <Search size={56} className="text-gray-300 mb-6" />
                    <h3 className="text-2xl font-bold text-gray-700 dark:text-white mb-2">
                      No users found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">
                      Try adjusting your search query.
                    </p>
                  </div>
                )}

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </>
            )}
          </div>
          <OwnerDetailsModal
            owner={selectedUser}
            isOpen={isModal}
            onClose={() => setIsModal(false)}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;

const StatCard = ({
  title,
  value,
  bgColor,
  icon,
}: {
  title: string;
  value: number;
  bgColor: string;
  icon: React.ReactNode;
}) => {
  return (
    <motion.div
      className="rounded-2xl p-7 flex flex-col gap-1 shadow-lg text-gray-900 dark:text-white relative overflow-hidden"
      style={{
        background: bgColor,
        boxShadow: "rgba(160, 161, 255, 0.12) 0px 12px 30px",
      }}
      whileHover={{
        y: -8,
        boxShadow: "rgba(100, 100, 180, 0.22) 0px 28px 60px",
        scale: 1.04,
      }}
      transition={{ duration: 0.16 }}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-800/80 dark:text-white/70 font-semibold">
          {title}
        </div>
        <div className="bg-white/30 shadow p-2 rounded-full">{icon}</div>
      </div>
      <div className="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white">
        {value}
      </div>
    </motion.div>
  );
};
