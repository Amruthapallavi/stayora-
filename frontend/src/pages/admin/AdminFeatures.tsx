import { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import { Wifi, AirVent, ParkingCircle, ShieldCheck, Tv, ThermometerSun, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../stores/authStore";
import { notifyError, notifySuccess } from "../../utils/notifications";
import { useNavigate } from "react-router-dom";
import {
  showConfirmAlert,
  showErrorAlert,
  showSuccessAlert,
} from "../../components/ConfirmationAlert";
import AdminLayout from "../../components/admin/AdminLayout";
import { IFeature } from "../../types/feature";
const iconOptions = [
  { name: "Wifi", icon: <Wifi size={28} />, value: "Wifi" },
  { name: "Air Conditioning", icon: <AirVent size={28} />, value: "AirVent" },
  { name: "Parking", icon: <ParkingCircle size={28} />, value: "ParkingCircle" },
  { name: "Security", icon: <ShieldCheck size={28} />, value: "ShieldCheck" },
  { name: "Smart TV", icon: <Tv size={28} />, value: "Tv" },
  { name: "Heating System", icon: <ThermometerSun size={28} />, value: "ThermometerSun" },
  { name: "Eco-Friendly", icon: <Leaf size={28} />, value: "Leaf" },
];



const AdminFeatures = () => {
  const { listAllFeatures, addFeature ,removeFeature,editFeature} = useAuthStore();
  const [features, setFeatures] = useState<IFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const [newFeature, setNewFeature] = useState({
    _id:"",
    name: "",
    description: "",
    icon: "",
  });

  useEffect(() => {
    loadFeatures();
  }, [addFeature,editFeature]);
  
  const loadFeatures = async () => {
    setIsLoading(true);
    try {
      const response = await listAllFeatures();
      setFeatures(response);
    } catch (error) {
      notifyError("Failed to load features.");
    } finally {
      setIsLoading(false);
    }
  };
 
  


  const openModal = (feature:IFeature | null=null) => {
    if (feature) {
      setIsEditing(true);
      setNewFeature({
        _id: feature._id, 
        name: feature.name,
        description: feature.description,
        icon: feature.icon || "",
      });
    } else {
      setIsEditing(false);
      setNewFeature({ _id:"",name: "", description: "", icon: "" });
    }
    setIsModalOpen(true);
  };
  

  const closeModal = () => {
    setIsModalOpen(false);
    setNewFeature({ _id: "", name: "", description: "", icon: "" });
  };

  const handleEditFeature = async (e: any) => {
    const { _id, name, description, icon } = newFeature;
  
    if (!_id || !name || !description) {
      notifyError("All fields are required.");
      return;
    }
  
    try {
        await editFeature(_id, newFeature);
      notifySuccess("Feature updated successfully");
      window.location.reload();
      // setFeatures((prevFeatures) =>
      //   prevFeatures.map((feature) => (feature.id === id ? response.feature : feature))
      // );
      // closeModal();
    } catch (err:any) {
      notifyError(err.response?.data?.message || "Failed to update feature.");
    }
  };
  
  // Handle Input Change
  const handleInputChange = (e:any) => {
    setNewFeature({ ...newFeature, [e.target.name]: e.target.value });
  };

  // Add Feature
  const handleAddFeature = async () => {
  
    const { name, description, icon } = newFeature;
  
    if (!name || !description ) {
      notifyError("All fields are required.");
      return;
    }
  
    try {
      const response = await addFeature(newFeature, "admin");
      // setFeatures(prev => [...prev, response.feature]); // Assuming this structure

        notifySuccess("New feature added successfully");
        closeModal();
      
    } catch (err: any) {
      notifyError(err.response?.data?.message || "Failed to add feature.");
    }
  };
  

  const handleIconSelect = (iconValue: string) => {
    setNewFeature((prev) => ({
      ...prev,
      icon: iconValue
    }));
  };
  
  // Remove Feature
  
    const handleRemoveFeature = async (id: string) => {
      const result = await showConfirmAlert(
        "Confirm Deletion",
        "Are you sure you want to remove this feature?",
        "remove",
        "Cancel"
      );
    
      if (result.isConfirmed) {
        try {
          console.log("Deleting owner with ID:", id);
          await removeFeature(id);
    
          // Remove the deleted owner from the list
          setFeatures((prev) => prev.filter((feature) => feature._id !== id));
    
          showSuccessAlert("The feature has been removed.");
        } catch (error) {
          showErrorAlert("Failed to remove feature.");
        }
      }
    };

  return (
    <AdminLayout>
    <div className="flex">

      {/* Main Content */}
      <div className="flex-1 min-h-screen bg-gray-100 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Property Features</h1>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700"
              onClick={() => openModal()}
            >
              + Add Feature
            </button>
          </div>

          {/* Features Grid */}
          {isLoading ? (
            <p>Loading features...</p>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {features.map((feature) => (
                <motion.div
                  key={feature._id}
                  className="bg-white p-6 rounded-lg shadow-md flex flex-col gap-4 border"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                      {iconOptions.find((opt) => opt.value === feature.icon)?.icon || "🔹"}
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">{feature.name}</h2>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </div>
                  {/* Buttons */}
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                      onClick={() => openModal(feature)}
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                      onClick={() => handleRemoveFeature(feature._id)}
                    >
                      Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

  {/* Modal */}
{isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-bold mb-4">{isEditing ? "Edit Feature" : "Add New Feature"}</h2>
      
      {/* Feature Name Input */}
      <input
        type="text"
        name="name"
        placeholder="Feature Name"
        value={newFeature.name}
        onChange={handleInputChange}
        className="w-full px-3 py-2 mb-3 border rounded-lg"
      />
      
      {/* Feature Description Input */}
      <textarea
        name="description"
        placeholder="Feature Description"
        value={newFeature.description}
        onChange={handleInputChange}
        className="w-full px-3 py-2 mb-3 border rounded-lg"
      ></textarea>

      {/* Icon Selection Dropdown */}
      <div className="mb-3">
        <label className="block text-gray-700 font-medium mb-2">Select Icon</label>
        <div className="relative">
          <select
            name="icon"
            value={newFeature.icon || ""}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-lg appearance-none"
          >
            <option value="">Choose an Icon</option>
            {iconOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Show Selected Icon Preview */}
      {newFeature.icon && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-gray-700">Selected Icon:</span>
          {
            iconOptions.find((option) => option.value === newFeature.icon)?.icon
          }
        </div>
      )}

      {/* Modal Buttons */}
      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 bg-gray-400 text-white rounded-lg" onClick={closeModal}>
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          onClick={() => (isEditing ? handleEditFeature(newFeature._id) : handleAddFeature())}
        >
          {isEditing ? "Update" : "Add"}
        </button>
      </div>
    </div>
  </div>
)}
{/* Modal */}
{isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-2xl font-bold mb-4">{isEditing ? "Edit Feature" : "Add New Feature"}</h2>

      {/* Feature Name Input */}
      <input
        type="text"
        name="name"
        placeholder="Feature Name"
        value={newFeature.name}
        onChange={handleInputChange}
        className="w-full px-3 py-2 mb-3 border rounded-lg"
      />

      {/* Feature Description Input */}
      <textarea
        name="description"
        placeholder="Feature Description"
        value={newFeature.description}
        onChange={handleInputChange}
        className="w-full px-3 py-2 mb-3 border rounded-lg"
      ></textarea>

      {/* Icon Selection */}
      <div className="mb-3">
        <label className="block text-gray-700 font-medium mb-2">Select Icon</label>
        <div className="flex flex-wrap gap-3 p-2 border rounded-lg">
          {iconOptions.map((option) => (
            <div
              key={option.value}
              className={`cursor-pointer p-2 rounded-lg border ${
                newFeature.icon === option.value ? "border-blue-500 bg-blue-100" : "border-gray-300"
              }`}
              onClick={() => handleIconSelect(option.value)}
            >
              {option.icon}
            </div>
          ))}
        </div>
      </div>

      {/* Show Selected Icon Preview */}
      {newFeature.icon && (
        <div className="flex items-center gap-2 mb-3">
          <span className="text-gray-700">Selected Icon:</span>
          {
            iconOptions.find((option) => option.value === newFeature.icon)?.icon
          }
        </div>
      )}

      {/* Modal Buttons */}
      <div className="flex justify-end gap-3">
        <button className="px-4 py-2 bg-gray-400 text-white rounded-lg" onClick={closeModal}>
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          onClick={() => (isEditing ? handleEditFeature(newFeature._id) : handleAddFeature())}
        >
          {isEditing ? "Update" : "Add"}
        </button>
      </div>
    </div>
  </div>
)}

    </div>
    </AdminLayout>
  );
};

export default AdminFeatures;
