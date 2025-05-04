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
import { PublicOnlyRoute } from "./components/auth/PublicRoutes";
import UserProfile from "./pages/user/UserProfile";
import OwnerProfile from "./pages/owners/OwnerProfile";
import OwnerPropertyListing from "./pages/owners/OwnerProperties";
import AddPropertyForm from "./pages/owners/AddProperty";
import Properties from "./pages/owners/properties";
import PropertyDetails from "./pages/owners/PropertyDetail";
import PropertyDetailedPage from "./pages/user/PropertyDetails";
import PropertyListing from "./pages/user/PropertyListing";
import CheckoutPage from "./pages/user/Checkout";
import AdminProperties from "./pages/admin/AdminProperties";
import Bookings from "./pages/user/UserBookings";
import OwnerBookings from "./pages/owners/Bookings";
import OwnerPropertyDetailedPage from "./pages/owners/PropertyDetail";
import EditProperty from "./pages/owners/EditProperty";
import AdminBookings from "./pages/admin/AdminBookings";
import BookingDetails from "./pages/owners/BookingDetails";
import UserBookingDetails from "./pages/user/UserBookingDetails";
import BookingDetail from "./pages/admin/BookingDetailedPage";
import PropertyDetail from "./pages/admin/PropertyDetailedPage";
// import ChatPage from "./pages/user/chatPage";
import UserWalletPage from "./pages/user/UserWallet";
import OwnerWalletPage from "./pages/owners/OwnerWallet";
import OwnerChatPage from "./pages/owners/Chat";
import ChatPage from "./pages/user/ChatPage";
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
          <Route element={<PublicOnlyRoute  />}>
          <Route >
          <Route path="/user/signup" element={<UserSignup />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/owner/login" element={<OwnerLogin />} />
          <Route path="/owner/signup" element={<OwnerSignup/>}/>
          <Route path="/admin/login" element={<AdminLogin />} />
          </Route>
        </Route>
        {/* <Route path="/properties" element={<Properties />} /> */}
        <Route path="/propertyDetail" element={<PropertyDetails />} />
        <Route path="/user/checkout" element={<CheckoutPage />} />

          <Route path="/user/verify-otp" element={<UserOtpVerification />} /> 
          {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
         
          <Route path="/user/forgot-pass" element={<ForgotPassword />} />
          <Route path="/owner/forgot-pass" element={<OwnerForgotPassword />} />
          <Route path="/owner/confirm-password" element={<ConfirmPassword />}/>
          <Route path="/user/confirm-password" element={<NewPassword />}/>

          <Route path="/owner/verify-otp" element={<OwnerOTPVerification />}/>
          <Route element={<ProtectedRoute allowedTypes={["user"]} />}>
          <Route >
            <Route path="/user/home" element={<UserHomePage />} />
            <Route path="/user/profile" element={<UserProfile />}/>
            <Route path="/user/properties" element={<PropertyListing />}/>
            <Route path="/user/bookings" element={<Bookings />}/>
            <Route path="/user/bookings/:id" element={<UserBookingDetails />}/>

            <Route path="/user/property/:id" element={<PropertyDetailedPage />} />
            <Route path="/user/chat/:propertyId/:ownerId" element={<ChatPage />} />
            <Route path="/user/chat" element={<ChatPage />} />

            <Route path="/user/wallet" element={<UserWalletPage />} />


          </Route>
        </Route>
        <Route element={<ProtectedRoute allowedTypes={["owner"]} />}>
          <Route >
            <Route path="/owner/dashboard" element={<OwnerHome />} />
            <Route path="/owner/profile" element={<OwnerProfile />}/>
            <Route path="/owner/properties" element={<OwnerPropertyListing />}/>
            <Route path="/owner/add-property" element={<AddPropertyForm />}/>
            <Route path="/owner/edit-property" element={<AddPropertyForm />}/>
            <Route path="/owner/property/:id" element={<OwnerPropertyDetailedPage />}/>
            <Route path="/owner/edit-property/:id" element={<EditProperty />}/>

            <Route path="/owner/bookings" element={<OwnerBookings />} />
            <Route path="/owner/bookings/:id" element={<BookingDetails />} />
            <Route path="/owner/chat" element={<OwnerChatPage />} />
            
            <Route path="/owner/wallet" element={<OwnerWalletPage />} />


          </Route>
        </Route>
        <Route element={<ProtectedRoute allowedTypes={["admin"]} />}>
          <Route >
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/properties" element={<AdminProperties />}/>
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/properties/:id" element={<PropertyDetail />}/>

            <Route path="/admin/owners" element={<OwnerListing/>}/>
            <Route path="/admin/bookings" element={<AdminBookings/>}/>
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/features" element={<AdminFeatures/>}/>
          <Route path="/admin/bookings/:id" element={<BookingDetail />} />

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