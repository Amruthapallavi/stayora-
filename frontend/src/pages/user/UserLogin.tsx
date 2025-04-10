// import React from "react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { notifySuccess, notifyError } from "../../utils/notifications";
import { authService } from "../../api/services/authService";

const UserLogin = () => {
  const navigate = useNavigate();
  const {login} = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");

    if (error === "google_auth_failed") {
      alert("Google authentication failed. Please try again.");
    }
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(formData.email, formData.password, "user");
      notifySuccess("Login successful!");
      navigate("/user/home");

    } catch (err: any) {
console.log(err);
      const errMsg =
        err.response?.data?.error || "Failed to login. Please try again.";

      setError(errMsg);
      notifyError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };
  const handleGoogleSignin = () => {
    try {
      const googleAuthUrl = authService.getGoogleAuthUrl();
      // Redirect to the Google auth endpoint
      console.log(googleAuthUrl);
      window.location.href = googleAuthUrl;
    } catch (error) {
      console.error("Error retrieving Google auth URL:", error);
      notifyError("Failed to initiate Google authentication.");
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/background.jpg')" }}>
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Left Panel */}
        <div className="md:w-1/3 bg-[#a0815c] flex items-center justify-center p-10" style={{ backgroundImage: "url('https://e0.pxfuel.com/wallpapers/673/923/desktop-wallpaper-high-resolution-nature-brown-nature.jpg')" }} >
          <h2 className="text-white text-3xl font-bold tracking-wide">STAYORA</h2>
        </div>

        {/* Right Panel */}
        <div className="md:w-2/3 p-8">
          <h2 className="text-3xl font-bold text-center mb-2">Welcome back</h2>
          <p className="text-center text-gray-500 mb-8">
            Sign in to continue to your account
          </p>
          {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700">Email:</label>
              <input
                type="email" name="email"
                placeholder="Enter your email" onChange={handleChange}
                className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a0815c]"
              />
            </div>

            <div>
              <label className="block text-gray-700">Password:</label>
              <input
                type="password" name="password" onChange={handleChange}
                placeholder="Enter your password"
                className="w-full mt-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a0815c]"
              />
              <div className="text-left mt-2">
                <p className="text-black-600 text-sm ">Don't have an account?<Link to='/user/signup' className="text-blue-600" >Signup</Link></p>
              </div>
              <div className="text-right mt-2">
                <Link to="/user/forgot-pass" className="text-blue-600 text-sm hover:underline">Forgot password?</Link>
              </div>
            </div>

            <button
              type="submit" disabled={isLoading}
              className="w-full bg-[#a0815c] text-white py-2 rounded-lg hover:bg-[#8a6d4f] transition"
            >
              Login
            </button>

            {/* Google Login */}
            <button
                type="button"
                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 border border-gray-300 rounded-md transition-colors flex items-center justify-center cursor-pointer"
                onClick={handleGoogleSignin}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;