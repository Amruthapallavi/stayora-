import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useEffect, useState } from "react";
import { notifyError } from "../../utils/notifications";

interface ProtectedRouteProps {
  allowedTypes: string[];
}

export const ProtectedRoute = ({ allowedTypes }: ProtectedRouteProps) => {
  const { isAuthenticated, authType, user, logout, getUserStatus } = useAuthStore();
  const location = useLocation();
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [isUserValid, setIsUserValid] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        if (authType === "admin") {
          setIsUserValid(true);
          return;
        }

        if (!user?.id) {
          setIsUserValid(false);
          logout();
          return;
        }

        const response = await getUserStatus(user.id);
        const isValid = response?.status?.toLowerCase() === "active";

        setIsUserValid(isValid);

        if (!isValid) {
          logout();
          notifyError("Something went wrong");
        }
      } catch (err) {
        console.error("❌ Error checking user status:", err);
        setIsUserValid(false);
        logout();
      } finally {
        setCheckingStatus(false);
      }
    };

    if (isAuthenticated) {
      checkUserStatus();
    } else {
      setCheckingStatus(false);
    }
  }, [isAuthenticated, location.pathname]);

  if (checkingStatus) return <div>Loading...</div>;

  if (!isAuthenticated || !isUserValid) {
    const redirectPath = location.pathname.includes("/owner")
      ? "/owner/login"
      : location.pathname.includes("/admin")
      ? "/admin/login"
      : "/user/login";

    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (!allowedTypes.includes(authType ?? "")) {
    const dashboardPath =
      authType === "owner"
        ? "/owner/dashboard"
        : authType === "admin"
        ? "/admin/dashboard"
        : "/user/dashboard";

    return <Navigate to={dashboardPath} replace />;
  }

  return <Outlet />;
};
