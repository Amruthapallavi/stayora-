import { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import { Search, Eye, CheckCircle, Unlock, X, Ban, Trash2 } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { notifySuccess, notifyError, notifyWarn } from "../../utils/notifications";
// import moment from "moment";
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total Owners", value: totalOwners },
              { label: "Active Owners", value: activeOwners },
              { label: "Unapproved Owners", value: unapprovedOwners },
              { label: "Blocked Owners", value: blockedOwners },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-md text-center"
              >
                <h2 className="text-2xl font-bold">{stat.value}</h2>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center bg-white p-4 rounded-lg shadow-md mb-6">
            <Search size={24} className="text-gray-600 mr-2" />
            <input
              type="text"
              placeholder="Search owner by name, email, or phone..."
              className="w-full p-2 border-none focus:outline-none"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-700">
                  {[
                    "Name",
                    "Email",
                    "Phone",
                    "ID Proof",
                    "Status",
                    "Actions",
                  ].map((header) => (
                    <th key={header} className="py-3 px-4 text-left border">
                      {header}
                    </th>
                  ))}
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
                      <td className="py-3 px-4 font-semibold">
                        <span
                          className={`px-2 py-1 text-white text-sm rounded ${
                            owner.status === "Pending"
                              ? "bg-yellow-500"
                              : owner.status === "Active"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        >
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
