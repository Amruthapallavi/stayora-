import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { notifySuccess, notifyError } from "../../utils/notifications";
import { useState } from "react";

const UserSignup = () => {
  const navigate = useNavigate();
  const { signup } = useAuthStore();

  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      await signup(formDataToSend, "user");
      notifySuccess("Signup successful. Please verify your email.");
      navigate("/user/verify-otp", {
        state: { email: formData.email, authType: "user" },
      });
    } catch (err: any) {
      const errMsg =
        err.response?.data?.message || "Failed to sign up. Please try again.";
      setError(errMsg);
      notifyError(errMsg);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6 bg-[#C3A37F]">
        <h1 className="text-xl font-bold text-black italic">Stayora</h1>
        <ul className="flex space-x-8">
          <li className="text-black hover:underline cursor-pointer">HOME</li>
          <li className="text-black hover:underline cursor-pointer">ABOUT</li>
          <li className="text-black hover:underline cursor-pointer">CONTACT</li>
          <li className="text-black hover:underline cursor-pointer">LOGIN</li>
        </ul>
      </nav>

      {/* Signup Form */}
      <div className="flex justify-center my-12">
        <div className="w-full max-w-lg">
          <h2 className="text-xl font-semibold mb-6 border-b-2 pb-2">Signup</h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 font-medium">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C3A37F]"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C3A37F]"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C3A37F]"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C3A37F]"
                required
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C3A37F]"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-[#C3A37F] text-white py-2 px-6 rounded-lg hover:bg-[#A38767]"
            >
              SIGN UP
            </button>
          </form>

          <p className="mt-4 text-gray-600">
            Already have an account?{" "}
            <span className="text-[#C3A37F] cursor-pointer">Signin</span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#C3A37F] text-white p-8">
        <div className="flex justify-between flex-wrap">
          <div className="space-y-2">
            <h3 className="font-bold">EXPLORE</h3>
            <p className="text-sm">HOTELS</p>
            <p className="text-sm">VILLAS</p>
            <p className="text-sm">STAYCATIONS</p>
            <p className="text-sm">STUDENT HOSTELS</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold">CONNECT US</h3>
            <p className="text-sm">Emergency services</p>
            <p className="text-sm">Contact Us</p>
            <p className="text-sm">Blog</p>
            <p className="text-sm">Location</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold">ABOUT US</h3>
            <p className="text-sm">Availability</p>
            <p className="text-sm">Good to Know</p>
            <p className="text-sm">About</p>
            <p className="text-sm">Support</p>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button className="bg-[#8C6B48] text-white py-2 px-4 rounded-lg hover:bg-[#755836]">
            Let's have a chat
          </button>
        </div>
      </footer>
    </div>
  );
};

export default UserSignup;
