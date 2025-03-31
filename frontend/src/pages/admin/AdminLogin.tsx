import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { notifySuccess, notifyError } from "../../utils/notifications";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(formData.email, formData.password, "admin");
      notifySuccess("Admin login successful!");
      navigate("/admin/dashboard");
    } catch (err:any) {
      const errMsg =
        err.response?.data?.error || "Failed to login. Please try again.";
      setError(errMsg);
      notifyError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/admin-bg.jpg')" }}
    >
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Panel */}
        <div
          className="md:w-1/3 bg-[#4a4a4a] flex items-center justify-center p-10"
          style={{
            backgroundImage: "url('https://source.unsplash.com/600x800/?office')",
          }}
        >
          <h2 className="text-white text-3xl font-bold tracking-wide">Admin Portal</h2>
        </div>

        {/* Right Panel */}
        <div className="md:w-2/3 p-8">
          <h2 className="text-3xl font-bold text-center mb-2">Admin Login</h2>
          <p className="text-center text-gray-500 mb-8">
            Sign in to access the admin dashboard
          </p>
          {error && (
            <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700">Admin Email:</label>
              <input
                type="email"
                name="email"
                placeholder="Enter admin email"
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a4a4a]"
              />
            </div>

            <div>
              <label className="block text-gray-700">Password:</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4a4a4a]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#4a4a4a] text-white py-2 rounded-lg hover:bg-[#363636] transition"
            >
              {isLoading ? "Logging in..." : "Admin Login"}
            </button>

            <div className="text-right mt-2">
              <Link
                to="/forgot-password"
                className="text-blue-600 text-sm hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
