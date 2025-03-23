import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Landing from "./pages/Landing";
// import { PublicOnlyRoute } from "./components/auth/PublicOnlyRoutes";
import UserSignup from "./pages/user/UserSignup";
import UserOtpVerification from "./pages/user/UserOtpVerification";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserLogin from "./pages/user/UserLogin";
import UserHomePage from "./pages/user/UserHome";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Welcome from "./pages/welcome";
import OwnerLogin from "./pages/owners/OwnerLogin";
import OwnerSignup from "./pages/owners/OwnerSignup";
import OwnerOTPVerification from "./pages/owners/OwnerOTPverification";
import {ProtectedRoute} from "./components/auth/ProtectedRoute";
import ForgotPassword from "./pages/user/ForgotPassword";
import OwnerHome from "./pages/owners/OwnerHomePage";
import NewPassword from "./pages/user/NewPassword";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminServices from "./pages/admin/AdminService";
import GoogleAuthCallback from './components/user/GoogleAuthCallback'
import AdminFeatures from "./pages/admin/AdminFeatures";
import OwnerForgotPassword from "./pages/owners/OwnerForgotPassword";
import ConfirmPassword from "./pages/owners/ConfirmPassword";
import OwnerListing from "./pages/admin/AdminOwners";
const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
      <Routes>
       
          <Route path="/" element={<Welcome />} />


          <Route path="/user/signup" element={<UserSignup />} />
          <Route path="/owner/login" element={<OwnerLogin />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/verify-otp" element={<UserOtpVerification />} /> 
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/services" element={<AdminServices />} />
<Route path="/admin/features" element={<AdminFeatures/>}/>
          <Route path="/user/forgot-pass" element={<ForgotPassword />} />
          <Route path="/owner/forgot-pass" element={<OwnerForgotPassword />} />
          <Route path="/owner/confirm-password" element={<ConfirmPassword />}/>
          <Route path="/admin/owners" element={<OwnerListing/>}/>
          <Route path="/user/home" element={<UserHomePage />} />
          <Route path="/user/confirm-password" element={<NewPassword />}/>
          <Route path="/owner/signup" element={<OwnerSignup/>}/>
          <Route path="/owner/verify-otp" element={<OwnerOTPVerification />}/>
          <Route element={<ProtectedRoute allowedTypes={["user"]} />}>
          <Route >
            <Route path="/user/home" element={<UserHomePage />} />
          </Route>
        </Route>
        <Route element={<ProtectedRoute allowedTypes={["owner"]} />}>
          <Route >
            <Route path="/owner/dashboard" element={<OwnerHome />} />
          </Route>
        </Route>
        <Route
  path="/auth/google/callback"
  element={<GoogleAuthCallback />}
/>



      </Routes>
    </BrowserRouter>
  );
};

export default App;