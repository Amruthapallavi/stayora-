
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { notifySuccess, notifyError } from "../../utils/notifications";

const GoogleAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUserFromToken } = useAuthStore();
  
  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      try {
        setUserFromToken(token, "user");
        notifySuccess("Logged in successfully via Google!");
        navigate("/user/home");
      } catch (error) {
        console.error("Error processing Google auth callback:", error);
        notifyError("Google authentication failed.");
        navigate("/user/login");
      }
    } else {
      notifyError("No token received from Google.");
      navigate("/user/login");
    }
  }, [searchParams, navigate, setUserFromToken]);

  return <div>Processing Google login...</div>;
};

export default GoogleAuthCallback;
