import { useState } from "react";
import { Mail, Lock, User, Phone, IdCard, UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { notifySuccess, notifyError } from "../../utils/notifications";

const OwnerSignup = () => {
  const navigate = useNavigate();
  const { signup } = useAuthStore();
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [govtId, setGovtId] = useState<File | null>(null);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        notifyError("Only JPG, PNG, or PDF files are allowed.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        notifyError("File size must be under 5MB.");
        return;
      }

      setGovtId(file);
      setPreview(URL.createObjectURL(file)); // Show preview for images
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      notifyError("Passwords do not match.");
      return;
    }

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      notifyError("Phone number must be exactly 10 digits.");
      return;
    }

    if (!govtId) {
      notifyError("Please upload a government ID.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      formDataToSend.append("govtId", govtId);
      console.log("Form Data Before Sending:", [...formDataToSend.entries()]);

      await signup(formDataToSend, "owner");
      notifySuccess("Signup successful. Please verify your email.");
      navigate("/owner/verify-otp", {
        state: { email: formData.email, authType: "owner" },
      });
    } catch (err: any) {
      const errMsg = err.response?.data?.message || "Failed to sign up. Please try again.";
      setError(errMsg);
      notifyError(errMsg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3]">
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="bg-[#b8860b] p-4 rounded-full">
            <User size={32} className="text-white" />
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Welcome to Owner Signup</h2>
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-600">Full Name</label>
            <div className="flex items-center border rounded-lg bg-gray-100 px-4">
              <User size={20} className="text-gray-500" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full p-3 bg-transparent focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-600">Email Address</label>
            <div className="flex items-center border rounded-lg bg-gray-100 px-4">
              <Mail size={20} className="text-gray-500" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full p-3 bg-transparent focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-600">Phone Number</label>
            <div className="flex items-center border rounded-lg bg-gray-100 px-4">
              <Phone size={20} className="text-gray-500" />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full p-3 bg-transparent focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Govt ID Upload */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-600">Government ID (JPG, PNG, PDF)</label>
            <div className="flex items-center border rounded-lg bg-gray-100 px-4 py-3">
              <UploadCloud size={20} className="text-gray-500 mr-2" />
              <input type="file" onChange={handleFileChange} className="w-full bg-transparent focus:outline-none" required />
            </div>
            {preview && <img src={preview} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-lg" />}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-600">Password</label>
            <div className="flex items-center border rounded-lg bg-gray-100 px-4">
              <Lock size={20} className="text-gray-500" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full p-3 bg-transparent focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block mb-2 text-gray-600">Confirm Password</label>
            <div className="flex items-center border rounded-lg bg-gray-100 px-4">
              <Lock size={20} className="text-gray-500" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full p-3 bg-transparent focus:outline-none"
                required
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-[#b8860b] hover:bg-[#a6750a] text-white font-semibold py-3 rounded-lg transition duration-300">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default OwnerSignup;
