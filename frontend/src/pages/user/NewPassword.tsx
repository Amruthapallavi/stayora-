import { useState, useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useLocation, useNavigate } from "react-router-dom";
import { notifySuccess, notifyError } from "../../utils/notifications";

const NewPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { verifyOtp, resetPassword } = useAuthStore();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [email, setEmail] = useState<string>("");
  const [showOtp, setShowOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      localStorage.setItem("email", location.state.email);
    } else {
      const storedEmail = localStorage.getItem("email");
      if (storedEmail) {
        setEmail(storedEmail);
      } else {
        alert("Email not found. Redirecting...");
        navigate("/register");
      }
    }
  }, [location, navigate]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value.slice(0, 1);
    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handleSubmitOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      setError("Please enter OTP.");
      notifyError("Please enter OTP.");
      return;
    }

    setIsLoading(true);
    try {
      await verifyOtp(email, otpValue, "user");
      notifySuccess("OTP verification successful. Set your new password.");
      setIsOtpVerified(true);
    } catch (error) {
      setError("OTP verification failed. Try again.");
      notifyError("OTP verification failed. Try again.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      notifyError("Passwords do not match.");
      return;
    }

    try {
      await resetPassword(email, newPassword,"user");
      
      notifySuccess("Password updated successfully. Please log in.");
      navigate("/user/login");
    } catch (error) {
      setError("Password update failed. Try again.");
      notifyError("Password update failed. Try again.");
      console.error(error);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3]">
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full">
        <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">{isOtpVerified ? "Set New Password" : "Verify Email"}</h2>

        {!isOtpVerified ? (
          <form onSubmit={(e) => { e.preventDefault(); handleSubmitOtp(); }}>
            <p>Please enter otp sended to <b>{email || "your email"}</b></p> <br />
            <div className="flex justify-center gap-3 mb-6">
              {otp.map((value, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  value={value}
                  onChange={(e) => handleChange(index, e.target.value)}
                  maxLength={1}
                  disabled={isOtpVerified}
                  className="w-12 h-12 text-center text-xl font-semibold text-[#b8860b] bg-[#e2d1c3] rounded-lg border border-[#b8860b] focus:outline-none"
                />
              ))}
            </div>

            <div className="flex items-center justify-center mb-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOtp}
                  onChange={() => setShowOtp(!showOtp)}
                />
                <span>Show OTP</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isOtpVerified}
              className="w-full bg-[#b8860b] hover:bg-[#a6750a] text-white font-semibold py-3 rounded-lg transition duration-300"
            >
              Verify
            </button>
          </form>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handlePasswordSubmit(); }}>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mb-4 p-3 border rounded-lg"
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mb-4 p-3 border rounded-lg"
              required
            />

            <button
              type="submit"
              className="w-full bg-[#b8860b] hover:bg-[#a6750a] text-white font-semibold py-3 rounded-lg transition duration-300"
            >
              Submit New Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default NewPassword;