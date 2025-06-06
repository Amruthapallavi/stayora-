import { useState, useEffect } from "react";
import { useAuthStore } from "../../stores/authStore";
import { useLocation, useNavigate } from "react-router-dom";
import { notifySuccess, notifyError } from "../../utils/notifications";

const OwnerOTPverification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { verifyOtp , resendOtp } = useAuthStore();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [email, setEmail] = useState<string>(""); 
  const [showOtp, setShowOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
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
  // Handle OTP input changes
  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return; // Only allow numbers
    const updatedOtp = [...otp];
    updatedOtp[index] = value.slice(0, 1);
    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handleSubmit = async () => {

    const otpValue = otp.join("");
    if (otpValue.length < 6) {
        notifyError("Please enter OTP.");
      return;
    }
    setIsLoading(true);
    try {
      await verifyOtp( email, otpValue,"owner");
      notifySuccess("OTP verification successful. Please Login to continue");
      navigate('/owner/login')
    } catch (error) {
      notifyError("OTP verification failed. Try again.");
      console.error(error);
    }finally{
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      await resendOtp(email,"owner");
      notifySuccess("OTP resent successfully!");
      setResendTimer(60);
    } catch (error) {
      notifyError("Failed to resend OTP.");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#ffff] ">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md bg-gradient-to-b from-[#fffff] to-[rgb(168, 123, 72)]">
        <h2 className="text-3xl font-semibold text-center mb-6">Enter OTP</h2>

        <p className="text-center mb-4 text-gray-600">
          Enter the 6-digit OTP sent to <b>{email || "your email"}</b>
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-between gap-2 mb-6">
          {otp.map((value, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type={showOtp ? "text" : "password"}
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              className="w-12 h-12 border-2 rounded-lg text-center text-xl focus:outline-none  border-[#b8860b] focus:outline-none"
              maxLength={1}
              autoFocus={index === 0}
            />
          ))}
        </div>

        {/* Show/Hide OTP */}
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

        {/* Verify Button */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full py-3 text-white font-semibold rounded-lg transition ${
            isLoading ? "bg-[#b8860b] hover:bg-[#a6750a] cursor-not-allowed" : "bg-[#b8860b] hover:bg-[#a6750a] "
          }`}
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* Resend OTP */}
        <div className="mt-6 text-center">
          {resendTimer > 0 ? (
            <span className="text-gray-600">
              Resend OTP in {resendTimer}s
            </span>
          ) : (
            <button
              onClick={handleResend}
              className="text-blue-600 hover:underline"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerOTPverification;
