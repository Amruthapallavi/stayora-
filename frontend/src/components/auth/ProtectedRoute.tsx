import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
import { useEffect, useState } from "react";
import { notifyError } from "../../utils/notifications";

interface ProtectedRouteProps {
  allowedTypes: string[];
}

export const ProtectedRoute = ({ allowedTypes }: ProtectedRouteProps) => {
  const {
    isAuthenticated,
    authType,
    user,
    logout,
    getUserStatus,
  } = useAuthStore();

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

        if (!user?.userId && !user?.id) {
          setIsUserValid(false);
          if (authType) logout();
          return;
        }

        const response = await getUserStatus(user.userId || user.id);
        const isValid = response?.status?.toLowerCase() === "active";

        setIsUserValid(isValid);

        if (!isValid) {
          notifyError("You are currently blocked");
          if (authType) logout();
        }
      } catch (err) {
        console.error("Error checking user status:", err);
        setIsUserValid(false);
        if (authType) logout();
      } finally {
        setCheckingStatus(false);
      }
    };

    if (isAuthenticated) {
      setCheckingStatus(true);
      checkUserStatus();
    } else {
      setIsUserValid(false);
      setCheckingStatus(false);
    }
  }, [isAuthenticated, authType, user, location.pathname, logout, getUserStatus]);

  if (checkingStatus) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin h-10 w-10 border-t-2 border-golden rounded-full"></div>
      </div>
    );
  }

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
