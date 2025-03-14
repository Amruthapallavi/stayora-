import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { notifyError, notifySuccess } from "../../utils/notifications";
import { useAuthStore } from "../../api/api";

const OwnerOTPVerification: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState("");
  const [email, setEmail] = useState<string>(""); // Capture from props or previous screen
  const { verifyOtp } = useAuthStore();

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [timer, setTimer] = useState<number>(60);


//   useEffect(() => {
//     if (location.state?.email) {
//       setEmail(location.state.email);
//     } else {
//       const storedEmail = localStorage.getItem("email");
//       if (storedEmail) {
//         setEmail(storedEmail);
//       } else {
//         alert("Email not found. Redirecting...");
//         navigate("/owner/signup");
//       }
//     }
//   }, [location, navigate]);

  const handleChange = (index: number, value: string) => {
    if (!isNaN(Number(value)) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        document.getElementById(`otp-input-${index + 1}`)?.focus();
      }
    }
  };

  const handleSubmit = async() => {
    console.log("Sending OTP verification for:", email); // Debug line

    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
        setError("Please enter valid OTP.");

      notifyError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
        const response = await verifyOtp({ email, otp: otpCode });

      console.log("Verifying OTP for: ", location.state?.email);
      notifySuccess("OTP Verified Successfully!");
      console.log(response)
      navigate("/owner/dashboard");
    } catch (error) {
        setError("OTP verification failed. Try again.");
      notifyError("Invalid OTP. Please try again.");
    }
  };

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const handleResendOTP = () => {
    if (timer === 0) {
      setTimer(120);
      notifySuccess("OTP resent successfully.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#fdfcfb] to-[#e2d1c3]">
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-md w-full">
        <h2 className="text-3xl font-bold mb-4 text-center text-gray-800">Verify Email</h2>
        <p className="text-center text-gray-600 mb-6">Please check your mail and enter the verification code</p>
        
        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((value, index) => (
              <input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                value={value}
                onChange={(e) => handleChange(index, e.target.value)}
                maxLength={1}
                className="w-12 h-12 text-center text-xl font-semibold text-[#b8860b] bg-[#e2d1c3] rounded-lg border border-[#b8860b] focus:outline-none"
              />
            ))}
          </div>

          <div className="text-center text-gray-600 mb-4">
            {timer > 0 ? (
              <>Didn't get OTP? Resend ({Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")})</>
            ) : (
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-[#b8860b] hover:underline"
              >
                Resend OTP
              </button>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-[#b8860b] hover:bg-[#a6750a] text-white font-semibold py-3 rounded-lg transition duration-300"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default OwnerOTPVerification;