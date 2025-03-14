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
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ForgotPassword from "./pages/user/ForgotPassword";

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
          <Route path="/user/forgot-pass" element={<ForgotPassword />} />
          <Route path="/user/home" element={<UserHomePage />} />

          <Route path="/owner/signup" element={<OwnerSignup/>}/>
          <Route path="/owner/verify-otp" element={<OwnerOTPVerification />}/>
          <Route element={<ProtectedRoute />}>
          </Route>


      </Routes>
    </BrowserRouter>
  );
};

export default App;