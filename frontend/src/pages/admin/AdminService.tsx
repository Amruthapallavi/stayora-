import { useEffect, useState } from "react";
import { Eye, CheckCircle, Ban, PlusCircle, X } from "lucide-react";
import Sidebar from "../../components/admin/Sidebar";
import { useAuthStore } from "../../stores/authStore";
import { notifyError, notifySuccess } from "../../utils/notifications";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AdminLayout from "../../components/admin/AdminLayout";

type Service = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  contactMail: string;
  contactNumber: string;
  status: "active" | "disabled";
};

const AdminServices = () => {
  const navigate = useNavigate();
  const { listServices, addService , updateServiceStatus } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    contactMail: "",
    contactNumber: "",
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setIsLoading(true);
    try {
      const response = await listServices();
      setServices(response.services);
    } catch (error) {
      notifyError("Failed to load services.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to ${currentStatus === "active" ? "disable" : "enable"} this service!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, change it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
    try {
      const newStatus = currentStatus === "active" ? "disabled" : "active";
      const response:any = await updateServiceStatus(id,newStatus);
      
      
  
      if (!response) throw new Error("Failed to update status");
  
      setServices((prev) =>
        prev.map((service) =>
          service._id === id ? { ...service, status: newStatus } : service
        )
      );
      window.location.reload();

      notifySuccess(`Service ${newStatus} successfully`);
    } catch (error) {
      notifyError("Error updating service status");
    }
  }
});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewService({ ...newService, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewService({ ...newService, image: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, description, price, contactMail, contactNumber } = newService;
    if (!name || !description || !price || !contactMail || !contactNumber) {
      notifyError("All fields are required.");
      return;
    }

    if (isNaN(Number(price)) || Number(price) <= 0) {
      notifyError("Enter a valid price.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactMail)) {
      notifyError("Enter a valid email.");
      return;
    }

    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(contactNumber)) {
      notifyError("Enter a valid phone number (10 digits).");
      return;
    }

    try {
      await addService(newService, "admin");
      notifySuccess("Service added successfully");
      navigate("/admin/services");
      loadServices();
      setIsModalOpen(false);
    } catch (err: any) {
      console.log(err);
      notifyError(err.response?.data?.message || "Failed to add service.");
    }
  };

  return (
    <AdminLayout>
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin - Services</h1>
          <button className="bg-green-600 text-white px-5 py-2 rounded flex items-center gap-2" onClick={() => setIsModalOpen(true)}>
            <PlusCircle size={20} /> Add Service
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-4">Service Name</th>
                <th className="p-4">Description</th>
                <th className="p-4">Price</th>
                <th className="p-4">Image</th>
                <th className="p-4">Contact Mail</th>
                <th className="p-4">Contact Number</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service._id} className="border-b hover:bg-gray-100">
                  <td className="p-4 font-medium">{service.name}</td>
                  <td className="p-4">{service.description}</td>
                  <td className="p-4">₹{service.price}</td>
                  <td className="p-4">
                    <img src={service.image} alt="Service" className="w-12 h-12 rounded" />
                  </td>
                  <td className="p-4">{service.contactMail}</td>
                  <td className="p-4">{service.contactNumber}</td>
                  <td className={`p-4 font-semibold ${service.status === "active" ? "text-green-600" : "text-red-600"}`}>
                    {service.status}
                  </td>
                  <td className="p-4 flex gap-4">
                    <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center gap-2">
                      <Eye size={18} /> Details
                    </button>
                    <button
                      className={`px-4 py-2 rounded flex items-center gap-2 ${
                        service.status === "active" ? "bg-red-500" : "bg-green-500"
                      } text-white`}
                      onClick={() => toggleStatus(service._id, service.status)}
                      >
                      {service.status === "active" ? <Ban size={18} /> : <CheckCircle size={18} />}
                      {service.status === "active" ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Add New Service</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleAddService}>
                <input type="text" name="name" placeholder="Service Name" className="w-full p-2 border rounded mb-3" onChange={handleChange} />
                <textarea name="description" placeholder="Description" className="w-full p-2 border rounded mb-3" onChange={handleChange} />
                <input type="text" name="price" placeholder="Price" className="w-full p-2 border rounded mb-3" onChange={handleChange} />
                <input type="file" className="w-full p-2 border rounded mb-3" onChange={handleImageChange} />
                <input type="email" name="contactMail" placeholder="Contact Email" className="w-full p-2 border rounded mb-3" onChange={handleChange} />
                <input type="text" name="contactNumber" placeholder="Contact Number" className="w-full p-2 border rounded mb-3" onChange={handleChange} />
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Add Service</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
    </AdminLayout>
  );
};

export default AdminServices;
