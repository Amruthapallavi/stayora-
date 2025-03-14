import { useState } from "react";
import { Mail, Lock, User, Phone, IdCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from '../../stores/authStore';

import { notifySuccess, notifyError } from "../../utils/notifications";

const OwnerSignup = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const { signup } = useAuthStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    govtId: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e:any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit =async (e:any) => {
    e.preventDefault();
    setError("");

    console.log("Owner Signup: ", formData);
    if (formData.password !== formData.confirmPassword) {
              setError("Passwords do not match.");
              notifyError("Passwords do not match.");
              return;
            }

            if (!/^[0-9]{10}$/.test(formData.phone)) {
              setError("Phone number must be exactly 10 digits.");
              notifyError("Phone number must be exactly 10 digits.");
              return;
            }

            try {
              await signup(formData, "owner");
              notifySuccess("Signup successful. Please verify your email.");
              navigate("/owner/verify-otp", {
                state: { email: formData.email, authType: "owner" },
              });
            } catch (err:any) {
              const errMsg =
                err.response?.data?.message || "Failed to sign up. Please try again.";
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
          <div className="mb-4">
            <label htmlFor="fullname" className="block mb-2 text-gray-600">Full Name</label>
            <div className="flex items-center border rounded-lg bg-gray-100 px-4">
              <User size={20} className="text-gray-500" />
              <input
                type="text"
                id="fullname"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full p-3 bg-transparent focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-gray-600">Email Address</label>
            <div className="flex items-center border rounded-lg bg-gray-100 px-4">
              <Mail size={20} className="text-gray-500" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className="w-full p-3 bg-transparent focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block mb-2 text-gray-600">Phone Number</label>
            <div className="flex items-center border rounded-lg bg-gray-100 px-4">
              <Phone size={20} className="text-gray-500" />
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full p-3 bg-transparent focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="govtId" className="block mb-2 text-gray-600">Government ID</label>
            <div className="flex items-center border rounded-lg bg-gray-100 px-4">
              <IdCard size={20} className="text-gray-500" />
              <input
                type="text"
                id="govtId"
                name="govtId"
                value={formData.govtId}
                onChange={handleChange}
                placeholder="Enter your government ID"
                className="w-full p-3 bg-transparent focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-gray-600">Password</label>
            <div className="flex items-center border rounded-lg bg-gray-100 px-4">
              <Lock size={20} className="text-gray-500" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full p-3 bg-transparent focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-2 text-gray-600">Confirm Password</label>
            <div className="flex items-center border rounded-lg bg-gray-100 px-4">
              <Lock size={20} className="text-gray-500" />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full p-3 bg-transparent focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#b8860b] hover:bg-[#a6750a] text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            Sign Up
          </button>

          <p className="mt-6 text-center text-gray-600">
            Already have an account? <a href="/owner/login" className="text-[#b8860b] hover:underline">Login here</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default OwnerSignup;
