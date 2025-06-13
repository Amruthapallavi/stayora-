import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { PublicOnlyRoute } from "./components/auth/PublicRoutes";
import LazyLoadErrorBoundary from "./components/error/LazyLoadErrorBoundary";
import Welcome from "./pages/welcome";
import NotFound from "./pages/owners/NotFound";
const UserSignup = lazy(() => import("./pages/user/UserSignup"));
const UserOtpVerification = lazy(() => import("./pages/user/UserOtpVerification"));
const UserLogin = lazy(() => import("./pages/user/UserLogin"));
const UserHomePage = lazy(() => import("./pages/user/UserHome"));
const UserProfile = lazy(() => import("./pages/user/UserProfile"));
const PropertyListing = lazy(() => import("./pages/user/PropertyListing"));
const PropertyDetailedPage = lazy(() => import("./pages/user/PropertyDetails"));
const CheckoutPage = lazy(() => import("./pages/user/Checkout"));
const Bookings = lazy(() => import("./pages/user/UserBookings"));
const UserBookingDetails = lazy(() => import("./pages/user/UserBookingDetails"));
const ChatPage = lazy(() => import("./pages/user/ChatPage"));
const NotificationsPage =lazy(()=>import("./pages/user/Notifications"))
const UserWalletPage = lazy(() => import("./pages/user/UserWallet"));
const ForgotPassword = lazy(() => import("./pages/user/ForgotPassword"));
const NewPassword = lazy(() => import("./pages/user/NewPassword"));

// Owner pages
const OwnerLogin = lazy(() => import("./pages/owners/OwnerLogin"));
const OwnerSignup = lazy(() => import("./pages/owners/OwnerSignup"));
const OwnerOTPVerification = lazy(() => import("./pages/owners/OwnerOTPverification"));
const OwnerHome = lazy(() => import("./pages/owners/OwnerHomePage"));
const OwnerProfile = lazy(() => import("./pages/owners/OwnerProfile"));
const OwnerPropertyListing = lazy(() => import("./pages/owners/OwnerProperties"));
const AddPropertyForm = lazy(() => import("./pages/owners/AddProperty"));
const PropertyDetails = lazy(() => import("./pages/owners/PropertyDetail"));
const OwnerPropertyDetailedPage = lazy(() => import("./pages/owners/PropertyDetail"));
const EditProperty = lazy(() => import("./pages/owners/EditProperty"));
const OwnerBookings = lazy(() => import("./pages/owners/Bookings"));
const BookingDetails = lazy(() => import("./pages/owners/BookingDetails"));
const OwnerChatPage = lazy(() => import("./pages/owners/Chat"));
const OwnerWalletPage = lazy(() => import("./pages/owners/OwnerWallet"));
const Subscribe = lazy(() => import("./pages/owners/SubscriptionPage"));
const OwnerForgotPassword = lazy(() => import("./pages/owners/OwnerForgotPassword"));
const ConfirmPassword = lazy(() => import("./pages/owners/ConfirmPassword"));

// Admin pages
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminServices = lazy(() => import("./pages/admin/AdminService"));
const AdminFeatures = lazy(() => import("./pages/admin/AdminFeatures"));
const AdminProperties = lazy(() => import("./pages/admin/AdminProperties"));
const AdminBookings = lazy(() => import("./pages/admin/AdminBookings"));
const OwnerListing = lazy(() => import("./pages/admin/AdminOwners"));
const BookingDetail = lazy(() => import("./pages/admin/BookingDetailedPage"));
const PropertyDetail = lazy(() => import("./pages/admin/PropertyDetailedPage"));

const GoogleAuthCallback = lazy(() => import("./components/user/GoogleAuthCallback"));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <span className="ml-3 text-gray-600">Loading...</span>
  </div>
);

const LoadingPage = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600 text-lg">Loading page...</p>
    </div>
  </div>
);

const LoadingDashboard = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <div className="text-center">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-48 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-32 mx-auto"></div>
      </div>
      <p className="text-gray-500 mt-4">Loading dashboard...</p>
    </div>
  </div>
);

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
      <LazyLoadErrorBoundary>
        <Routes>
        {/* Welcome page - not lazy loaded as it's the entry point */}
        <Route path="/" element={<Welcome />} />
        
        {/* Public only routes */}
        <Route element={<PublicOnlyRoute />}>
          <Route>
            <Route 
              path="/user/signup" 
              element={
                <Suspense fallback={<LoadingPage />}>
                  <UserSignup />
                </Suspense>
              } 
            />
            <Route 
              path="/user/login" 
              element={
                <Suspense fallback={<LoadingPage />}>
                  <UserLogin />
                </Suspense>
              } 
            />
            <Route 
              path="/owner/login" 
              element={
                <Suspense fallback={<LoadingPage />}>
                  <OwnerLogin />
                </Suspense>
              } 
            />
            <Route 
              path="/owner/signup" 
              element={
                <Suspense fallback={<LoadingPage />}>
                  <OwnerSignup />
                </Suspense>
              }
            />
            <Route 
              path="/admin/login" 
              element={
                <Suspense fallback={<LoadingPage />}>
                  <AdminLogin />
                </Suspense>
              } 
            />
          </Route>
        </Route>

        {/* Public routes */}
        <Route 
          path="/propertyDetail" 
          element={
            <Suspense fallback={<LoadingPage />}>
              <PropertyDetails />
            </Suspense>
          } 
        />
        <Route 
          path="/user/checkout" 
          element={
            <Suspense fallback={<LoadingPage />}>
              <CheckoutPage />
            </Suspense>
          } 
        />

        {/* Verification and password reset routes */}
        <Route 
          path="/user/verify-otp" 
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <UserOtpVerification />
            </Suspense>
          } 
        />
        <Route 
          path="/user/forgot-pass" 
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <ForgotPassword />
            </Suspense>
          } 
        />
        <Route 
          path="/owner/forgot-pass" 
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <OwnerForgotPassword />
            </Suspense>
          } 
        />
        <Route 
          path="/owner/confirm-password" 
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <ConfirmPassword />
            </Suspense>
          }
        />
        <Route 
          path="/user/confirm-password" 
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <NewPassword />
            </Suspense>
          }
        />
        <Route 
          path="/owner/verify-otp" 
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <OwnerOTPVerification />
            </Suspense>
          }
        />

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute allowedTypes={["user"]} />}>
          <Route>
            <Route 
              path="/user/home" 
              element={
                <Suspense fallback={<LoadingDashboard />}>
                  <UserHomePage />
                </Suspense>
              } 
            />
            <Route 
              path="/user/profile" 
              element={
                <Suspense fallback={<LoadingPage />}>
                  <UserProfile />
                </Suspense>
              }
            />
            <Route 
              path="/user/properties" 
              element={
                <Suspense fallback={<LoadingPage />}>
                  <PropertyListing />
                </Suspense>
              }
            />
            <Route 
              path="/user/bookings" 
              element={
                <Suspense fallback={<LoadingPage />}>
                  <Bookings />
                </Suspense>
              }
            />
            <Route 
              path="/user/bookings/:id" 
              element={
                <Suspense fallback={<LoadingPage />}>
                  <UserBookingDetails />
                </Suspense>
              }
            />
            <Route 
              path="/user/property/:id" 
              element={
                <Suspense fallback={<LoadingPage />}>
                  <PropertyDetailedPage />
                </Suspense>
              } 
            />
            <Route 
              path="/user/chat/:propertyId/:ownerId" 
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ChatPage />
                </Suspense>
              } 
            />
            <Route 
              path="/user/chat" 
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <ChatPage />
                </Suspense>
              } 
            />
            <Route 
              path="/user/notifications" 
              element={
                <Suspense fallback={<LoadingPage />}>
                  <NotificationsPage />
                </Suspense>
              }
            />
            <Route 
              path="/user/wallet" 
              element={
                <Suspense fallback={<LoadingPage />}>
                  <UserWalletPage />
                </Suspense>
              } 
            />
          </Route>
        </Route>

        {/* Protected Owner Routes */}
        <Route element={<ProtectedRoute allowedTypes={["owner"]} />}>
          <Route>
            <Route 
              path="/owner/dashboard" 
              element={
                <Suspense fallback={<LoadingDashboard />}>
                  <OwnerHome />
                </Suspense>
              } 
            />
            <Route 
              path="/owner/profile" 
              element={
                <Suspense fallback={<LoadingPage />}>
                  <OwnerProfile />
                </Suspense>
              }
            />
            <Route 
              path="/owner/properties" 
              element={
                <Suspense fallback={<LoadingPage />}>
                  <OwnerPropertyListing />
                </Suspense>
              }
            />
            <Route 
              path="/owner/add-property" 
              element={
                <Suspense fallback={<LoadingPage />}>
                  <AddPropertyForm />
                </Suspense>
              }
            />
            <Route 
              path="/owner/edit-property" 
              element={
                <Suspense fallback={<LoadingPage />}>
                  <AddPropertyForm />
                </Suspense>
              }
            />
            <Route 
              path="/owner/property/:id" 
              element={
                <Suspense fallback={<LoadingPage />}>
                  <OwnerPropertyDetailedPage />
                </Suspense>
              }
            />
            <Route 
              path="/owner/edit-property/:id" 
              element={
                <Suspense fallback={<LoadingPage />}>
                  <EditProperty />
                </Suspense>
              }
            />
            <Route 
              path="/owner/bookings" 
              element={
                <Suspense fallback={<LoadingPage />}>
                  <OwnerBookings />
                </Suspense>
              } 
            />
            <Route 
              path="/owner/bookings/:id" 
              element={
                <Suspense fallback={<LoadingPage />}>
                  <BookingDetails />
                </Suspense>
              } 
            />
            <Route 
              path="/owner/chat" 
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <OwnerChatPage />
                </Suspense>
              } 
            />
            <Route 
              path="/owner/subscription" 
              element={
                <Suspense fallback={<LoadingPage />}>
                  <Subscribe />
                </Suspense>
              } 
            />
            <Route 
              path="/owner/wallet" 
              element={
                <Suspense fallback={<LoadingPage />}>
                  <OwnerWalletPage />
                </Suspense>
              } 
            />
          </Route>
        </Route>

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute allowedTypes={["admin"]} />}>
          <Route>
            <Route 
              path="/admin/dashboard" 
              element={
                <Suspense fallback={<LoadingDashboard />}>
                  <AdminDashboard />
                </Suspense>
              } 
            />
            <Route 
              path="/admin/properties" 
              element={
                <Suspense fallback={<LoadingPage />}>
                  <AdminProperties />
                </Suspense>
              }
            />
            <Route 
              path="/admin/users" 
              element={
                <Suspense fallback={<LoadingPage />}>
                  <AdminUsers />
                </Suspense>
              } 
            />
            <Route 
              path="/admin/properties/:id" 
              element={
                <Suspense fallback={<LoadingPage />}>
                  <PropertyDetail />
                </Suspense>
              }
            />
            <Route 
              path="/admin/owners" 
              element={
                <Suspense fallback={<LoadingPage />}>
                  <OwnerListing />
                </Suspense>
              }
            />
            <Route 
              path="/admin/bookings" 
              element={
                <Suspense fallback={<LoadingPage />}>
                  <AdminBookings />
                </Suspense>
              }
            />
            <Route 
              path="/admin/services" 
              element={
                <Suspense fallback={<LoadingPage />}>
                  <AdminServices />
                </Suspense>
              } 
            />
            <Route 
              path="/admin/features" 
              element={
                <Suspense fallback={<LoadingPage />}>
                  <AdminFeatures />
                </Suspense>
              }
            />
            <Route 
              path="/admin/bookings/:id" 
              element={
                <Suspense fallback={<LoadingPage />}>
                  <BookingDetail />
                </Suspense>
              } 
            />
          </Route>
        </Route>

        {/* Special routes */}
        <Route
          path="/auth/google/callback"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <GoogleAuthCallback />
            </Suspense>
          }
        />
        
        {/* 404 - Not lazy loaded as it's simple */}
        <Route path="*" element={<NotFound />} />
        </Routes>
      </LazyLoadErrorBoundary>
    </BrowserRouter>
  );
};

export default App;