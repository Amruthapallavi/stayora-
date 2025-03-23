import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { notifyError, notifySuccess } from "../../utils/notifications";

const OwnerLogin = () => {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const {login} = useAuthStore();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
try {
      await login(formData.email, formData.password, "owner");
      notifySuccess("Login successful!");
      navigate("/owner/dashboard");
    } catch (err: any) {
      const errMsg =
        err.response?.data?.error || "Failed to login. Please try again.";
      setError(errMsg);
      notifyError(errMsg);
    } finally {
      setIsLoading(false);
    }  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3]">
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="bg-[#b8860b] p-4 rounded-full">
            <User size={32} className="text-white" />
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Welcome Back!</h2>
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-gray-600">
              Email Address
            </label>
            <div className="flex items-center border rounded-lg bg-gray-100 px-4">
              <Mail size={20} className="text-gray-500" />
              <input
                type="email"
                id="email"
                name="email"
                onChange={handleChange}
                placeholder="Enter your email address"
                className="w-full p-3 bg-transparent focus:outline-none"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label htmlFor="password" className="block mb-2 text-gray-600">
              Password
            </label>
            <div className="flex items-center border rounded-lg bg-gray-100 px-4">
              <Lock size={20} className="text-gray-500" />
              <input
                type="password"
                id="password"
                name="password"
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full p-3 bg-transparent focus:outline-none"
                required
              />
            </div>
            <div className="text-right mt-2">
                <Link to="/owner/forgot-pass" className="text-blue-600 text-sm hover:underline">Forgot password?</Link>
              </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-[#b8860b] hover:bg-[#a6750a] text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            Login
          </button>

          <p className="mt-6 text-center text-gray-600">
            Don't have an account? <a href="/owner/signup" className="text-[#b8860b] hover:underline">Sign up here</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default OwnerLogin;
