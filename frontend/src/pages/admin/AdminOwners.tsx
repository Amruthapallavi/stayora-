import { useState, useEffect } from "react";
import { Search, Eye, CheckCircle, Unlock, X, Ban, Trash2, Clock } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { notifySuccess, notifyError, notifyWarn } from "../../utils/notifications";
import { motion, AnimatePresence } from "framer-motion";// import moment from "moment";
// import Swal from "sweetalert2";

import {
  showConfirmAlert,
  showSuccessAlert,
} from "../../components/ConfirmationAlert";
import {
  showStatusChangeAlert,
  showErrorAlert,
} from "../../components/alert/AlertService";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";

type Owner = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  govtId: string;
  govtIdStatus:'pending'|'approved'|'rejected';

  status: "Pending" | "Active" | "Blocked";
  isVerified: boolean;
};

const OwnerListing = () => {
  const { listAllOwners, approveOwner, updateOwnerStatus, deleteUser ,rejectOwner} =
    useAuthStore();
    const navigate=useNavigate();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const OwnersPerPage = 5;

  useEffect(() => {
    loadOwners();
  }, []);

  const loadOwners = async () => {
    try {
      const response = await listAllOwners();
      setOwners(response.owners || []);
    } catch (error) {
      notifyError("Failed to load owners.");
    }
  };

  const handleSearch = (e: any) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset pagination on search
  };

  const filteredOwners = owners.filter(
    (owner) =>
      owner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      owner.phone.includes(searchQuery)
  );

  const totalPages = Math.ceil(filteredOwners.length / OwnersPerPage);
  const currentOwners = filteredOwners.slice(
    (currentPage - 1) * OwnersPerPage,
    currentPage * OwnersPerPage
  );

  const totalOwners = owners.length;
  const activeOwners = owners.filter((o) => o.status === "Active").length;
  const unapprovedOwners = owners.filter((o) => o.govtIdStatus === "pending").length;
  const blockedOwners = owners.filter((o) => o.status === "Blocked").length;

  const handleViewIDProof = (owner: Owner) => {
    setSelectedOwner(owner);
    setIsModalOpen(true);
  };
  const handleApprove = async (id: string) => {
    try {
      await approveOwner(id);
      notifySuccess("Owner approved successfully.");
      setIsModalOpen(false);

      loadOwners();

    } catch (error) {
      notifyError("Failed to approve owner.");
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    console.log("User ID:", id, "Current Status:", currentStatus);
  
    const action = currentStatus === "Blocked" ? "Unblock" : "Block";
    const result = await showStatusChangeAlert(action);
  
    if (result.isConfirmed) {
      try {
        const newStatus = currentStatus === "Active" ? "Blocked" : "Active";
        console.log("New Status:", newStatus);
  
        const response = await updateOwnerStatus(id, newStatus);
        console.log("Response from updateOwnerStatus:", response);
  
        if (!response || response.error) {
          throw new Error(response?.message || "Failed to update status");
        }
  
        // Update the owner list without refreshing
        setOwners((prevOwners) =>
          prevOwners.map((owner) =>
            owner._id === id ? { ...owner, status: newStatus } : owner
          )
        );
  
        showSuccessAlert(`User ${newStatus} successfully`);
      } catch (error) {
        console.error("Error updating status:", error);
        showErrorAlert("Error updating user status");
      }
    }
  };
  
  const handleDelete = async (id: string) => {
    const result = await showConfirmAlert(
      "Confirm Deletion",
      "Are you sure you want to delete this owner?",
      "Delete",
      "Cancel"
    );
  
    if (result.isConfirmed) {
      try {
        console.log("Deleting owner with ID:", id);
        await deleteUser(id, "owner");
  
        // Remove the deleted owner from the list
        setOwners((prevOwners) => prevOwners.filter((owner) => owner._id !== id));
  
        showSuccessAlert("The owner has been removed.");
      } catch (error) {
        showErrorAlert("Failed to delete owner.");
      }
    }
  };
  

  const handleReject= async (id: string,rejectionReason:string) => {
    if(!rejectionReason){
      notifyError("Please enter the reason for rejecting...");

       return 
    }
    const result = await showConfirmAlert(
      "Confirm Rejection",
      "Are you sure you want to reject this owner?",
      "Confirm Reject",
      "Cancel"
    );

    if (result.isConfirmed) {
      try {
        await rejectOwner(id,rejectionReason);

        showSuccessAlert("The owner has been removed.");
        loadOwners();
        window.location.reload();
      } catch (error) {
        showErrorAlert("Failed to delete owner.");
      }
    }
  };

  return (
    <AdminLayout>
    <div className="flex">
     
      <div className="flex-1 min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          <StatCard 
            title="Total Users" 
            value={totalOwners} 
            bgColor="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
            icon={<Eye className="text-blue-600" size={30} />}
          />
          <StatCard 
            title="Active Users" 
            value={activeOwners} 
            bgColor="linear-gradient(135deg, #c1dfc4 0%, #deecdd 100%)"
            icon={<CheckCircle className="text-green-500" size={30} />}
          />
          <StatCard 
            title="Blocked Users" 
            value={blockedOwners} 
            bgColor="linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)"
            icon={<Ban className="text-red-500" size={30} />}
          />
          <StatCard 
            title="Unverified Users" 
            value={unapprovedOwners} 
            bgColor="linear-gradient(135deg, #fff1eb 0%, #ace0f9 100%)"
            icon={<CheckCircle className="text-yellow-500 opacity-80" size={30} />}
          />
        </motion.div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl mb-8 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-xl font-bold text-gray-700 dark:text-white flex-shrink-0">
            Owners List
          </h2>
          <div className="w-full sm:w-[340px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search owners..."
                className="pl-10 pr-4 py-2 w-full rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-500 focus:ring-2 focus:ring-blue-400 focus:outline-none shadow-sm transition-all"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>

          <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <table className="w-full border-collapse">
            <thead>
                    <tr className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:bg-gray-800/70 text-left">
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-300 font-bold">Name</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-300 font-bold">Email</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-300 font-bold">Phone</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-300 font-bold">ID Proof</th>

                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-300 font-bold">Status</th>
                      <th className="px-6 py-4 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-300 font-bold">Actions</th>
                    </tr>
                  </thead>
              <tbody>
                {currentOwners.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-4">
                      No owners found.
                    </td>
                  </tr>
                ) : (
                  currentOwners.map((owner) => (
                    <tr key={owner._id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{owner.name}</td>
                      <td className="py-3 px-4">{owner.email}</td>
                      <td className="py-3 px-4">{owner.phone}</td>
                      <td className="py-3 px-4">
                        <button
                          className="text-blue-500"
                          onClick={() => handleViewIDProof(owner)}
                        >
                          View
                        </button>
                      </td>
                      <td className="px-6 py-4">
  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold
    ${owner.status === "Active"
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      : owner.status === "Pending"
      ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    }`}>
    {owner.status === "Active" ? (
      <CheckCircle size={14} className="text-green-400" />
    ) : owner.status === "Pending" ? (
      <Clock size={14} className="text-orange-400" />
    ) : (
      <Ban size={14} className="text-red-400" />
    )}
    {owner.status}
  </span>
</td>
                      <td className="py-3 px-4 flex items-center space-x-2">
                        <button
                          className="text-blue-500 p-1 hover:bg-gray-200 rounded"
                          title="Details"
                          onClick={() =>
                            alert(
                              `Owner Details: ${JSON.stringify(owner, null, 2)}`
                            )
                          }
                        >
                          <Eye size={18} />
                        </button>
                        {owner.status === "Pending" && (
                          <button
                            className="text-green-500 p-1 hover:bg-gray-200 rounded"
                            title="Approve"
                            onClick={() => handleApprove(owner._id)}
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        {owner.status === "Active" && (
                          <button
                            className="text-red-500 p-1 hover:bg-gray-200 rounded"
                            title="block"
                            onClick={() =>
                              toggleStatus(owner._id, owner.status)
                            }
                          >
                            <Ban size={18} />
                          </button>
                        )}
                        {owner.status === "Blocked" && (
                          <button
                            className="text-green-500 p-1 hover:bg-gray-200 rounded"
                            title="unblock"
                            onClick={() =>
                              toggleStatus(owner._id, owner.status)
                            }
                          >
                            <Unlock size={18} />
                          </button>
                        )}
                        <button
                          className="text-gray-600 p-1 hover:bg-gray-200 rounded"
                          title="Delete"
                          onClick={() => handleDelete(owner._id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-gray-700 font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && selectedOwner && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center relative">
        <h2 className="text-xl font-semibold mb-4">Owner ID Proof</h2>
        <img
          src={selectedOwner.govtId}
          alt="ID Proof"
          className="w-full h-64 object-cover rounded-lg mb-4 shadow-md"
        />
  
        {/* Show Approve & Reject buttons only if govtIdStatus is 'pending' */}
        {selectedOwner.govtIdStatus === "pending" ? (
          <>
            {isRejecting && (
              <div className="mb-4">
                <textarea
                  className="w-full p-2 border rounded"
                  placeholder="Enter rejection reason..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
            )}
  
            <div className="flex justify-between">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={() => handleApprove(selectedOwner._id)}
              >
                Approve
              </button>
  
              {!isRejecting ? (
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() => setIsRejecting(true)}
                >
                  Reject
                </button>
              ) : (
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  onClick={() =>
                    handleReject(selectedOwner._id, rejectionReason)
                  }
                >
                  Confirm Reject
                </button>
              )}
            </div>
          </>
        ) : (
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mt-4"
            onClick={() => setIsModalOpen(false)}
          >
            Back
          </button>
        )}
  
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black"
          onClick={() => setIsModalOpen(false)}
        >
          ✕
        </button>
      </div>
    </div>
      )}
    </div>
    </AdminLayout>
  );
};

export default OwnerListing;

const StatCard = ({ title, value, bgColor, icon }: { 
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
        boxShadow: "rgba(160, 161, 255, 0.12) 0px 12px 30px"
      }}
      whileHover={{ y: -8, boxShadow: "rgba(100, 100, 180, 0.22) 0px 28px 60px", scale: 1.04 }}
      transition={{ duration: 0.16 }}
    >
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-800/80 dark:text-white/70 font-semibold">{title}</div>
        <div className="bg-white/30 shadow p-2 rounded-full">{icon}</div>
      </div>
      <div className="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white">{value}</div>
    </motion.div>
  );
};