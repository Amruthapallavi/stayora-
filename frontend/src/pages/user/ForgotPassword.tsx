import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { notifySuccess, notifyError } from "../../utils/notifications";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { forgotPassword } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      notifyError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      await forgotPassword(email, "user");
      notifySuccess("OTP sent successfully! Check your email.");
      navigate("/user/confirm-password", { state: { email } });
    } catch (err: any) {
      const errMsg =
        err.response?.data?.error || "Failed to send OTP. Please try again.";
      setError(errMsg);
      notifyError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3]">
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full">
        <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">
          Forgot Password
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your email to receive an OTP for password reset
        </p>
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-600 mb-2"
          >
            Enter your email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-[#b8860b] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b8860b]"
            required
          />
          <button
            type="submit"
            className="w-full mt-4 px-4 py-2 bg-[#b8860b] text-white rounded-lg hover:bg-[#a6750a] transition-all"
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
