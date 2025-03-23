import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleGoogleAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      let token = urlParams.get("token");

      console.log("Extracted Token:", token);

      if (token) {
        // Store token properly before navigating
        document.cookie = `auth-token=${token}; path=/; secure; samesite=strict`;
        localStorage.setItem("auth-token", token);

        console.log("Redirecting to /user/home");
        setTimeout(() => {
          navigate("/user/home"); // Give some time before redirecting
        }, 500);
      } else {
        // If no token, try retrieving it from localStorage
        token = localStorage.getItem("auth-token");
        if (token) {
          console.log("Token found in localStorage, redirecting to /user/home");
          navigate("/user/home");
        } else {
          console.log("No token found, redirecting to /login");
          navigate("/login");
        }
      }
    };

    handleGoogleAuth();
  }, [navigate]);

  return <p>Processing Google login...</p>;
};

export default GoogleAuthCallback;
