import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";

interface ProtectedRouteProps {
  allowedTypes: string[];
}

export const ProtectedRoute = ({ allowedTypes }: ProtectedRouteProps) => {
  const { isAuthenticated, authType } = useAuthStore();
  const location = useLocation();
  console.log(isAuthenticated,authType)
  if (!isAuthenticated) {
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