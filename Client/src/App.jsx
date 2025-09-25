import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import LandingHeader from "./Landing/LandingHeader";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Footer from "./Components/Footer";

// AUTHENTICATION RE-ENABLED - ProtectedRoute import added back
import ProtectedRoute from "./Components/ProtectedRoute";

const Home = lazy(() => import("./Landing/Home"));
const Login = lazy(() => import("./Landing/Login"));
const Register = lazy(() => import("./Landing/Register"));
const Account = lazy(() => import("./pages/Account"));
const Search = lazy(() => import("./pages/Search"));
const BookingRequest = lazy(() => import("./pages/BookingRequest"));
const ActivityBookingRequest = lazy(() =>
  import("./pages/ActivityBookingRequest")
);
const ContactForm = lazy(() => import("./pages/ContactForm"));
const HotelProfile = lazy(() => import("./pages/HotelProfile"));
const RoomProfile = lazy(() => import("./pages/RoomProfile"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Bookings = lazy(() => import("./pages/Bookings"));
const SpecialOffers = lazy(() => import("./pages/SpecialOffers"));
const Settings = lazy(() => import("./pages/Settings"));
const AdminPanel = lazy(() => import("./pages/AdminPanel"));
const Tours = lazy(() => import("./pages/Tours"));
const TourDetails = lazy(() => import("./pages/TourDetails"));
const TourBooking = lazy(() => import("./pages/TourBooking"));
const InquiryPage = lazy(() => import("./pages/InquiryPage"));
const RoomInquiry = lazy(() => import("./pages/RoomInquiry"));
const Activities = lazy(() => import("./pages/Activities"));
const ActivityDetail = lazy(() => import("./pages/ActivityDetail"));
const ActivityForm = lazy(() => import("./pages/admin/ActivityForm"));
const AdminActivityDetail = lazy(() => import("./pages/admin/ActivityDetail"));
const AdminActivityView = lazy(() => import("./pages/admin/AdminActivityView"));
const AdminActivities = lazy(() => import("./pages/admin/Activities"));
const ActivityBookings = lazy(() => import("./pages/admin/ActivityBookings"));
const StaffDashboard = lazy(() => import("./pages/staff/StaffDashboard"));
const StaffActivityBookings = lazy(() => import("./pages/staff/StaffActivityBookings"));

// point axios at your API & send cookies by default
// Use environment variable if available, otherwise fallback based on mode
const baseURL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://api.islekeyholidays.com/api'
    : '/api');

axios.defaults.baseURL = baseURL;
axios.defaults.withCredentials = true;

export default function App() {
  const { authVersion } = useContext(AuthContext) || { authVersion: 0 };
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isStaffRoute = location.pathname.startsWith("/staff");
  const isLayoutRoute = isAdminRoute || isStaffRoute;

  // Add/remove admin-layout class based on route
  useEffect(() => {
    if (isLayoutRoute) {
      document.body.classList.add("admin-layout");
    } else {
      document.body.classList.remove("admin-layout");
    }

    // Cleanup on component unmount
    return () => {
      document.body.classList.remove("admin-layout");
    };
  }, [isLayoutRoute]);

  return (
    <Suspense fallback={<div className="text-center py-10">Loading…</div>}>
  {/* Only show LandingHeader if not on admin or staff route. Key forces remount on auth changes */}
  {!isLayoutRoute && <LandingHeader key={`lh-${authVersion}`} />}
      <div style={{ paddingTop: !isLayoutRoute ? "80px" : "0px" }}>
        <Routes>
          {/* public */}
          <Route
            path="/"
            element={
              <>
                <Home />
                <Footer />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Login />
                <Footer />
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <Register />
                <Footer />
              </>
            }
          />
          <Route
            path="/account"
            element={
              <>
                <Account />
                <Footer />
              </>
            }
          />

          {/* pages without sidebar */}
          <Route
            path="/contact"
            element={
              <>
                <ContactForm />
                <Footer />
              </>
            }
          />
          <Route
            path="/search"
            element={
              <>
                <Search />
                <Footer />
              </>
            }
          />
          <Route
            path="/special-offers"
            element={
              <>
                <SpecialOffers />
                <Footer />
              </>
            }
          />

          {/* protected - AUTHENTICATION RE-ENABLED for user-specific pages */}
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
                <Footer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <Bookings />
                <Footer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookingRequest"
            element={
              <ProtectedRoute>
                <BookingRequest />
                <Footer />
              </ProtectedRoute>
            }
          />

          {/* hotel search */}

          {/* hotel/room profiles */}
          <Route
            path="/hotels/:hotelId"
            element={
              <>
                <HotelProfile />
                <Footer />
              </>
            }
          />
          <Route
            path="/hotels/:hotelId/rooms/:roomId"
            element={
              <>
                <RoomProfile />
                <Footer />
              </>
            }
          />

          {/* tour search */}
          <Route
            path="/tours"
            element={
              <>
                <Tours />
                <Footer />
              </>
            }
          />

          {/* tour packages */}
          <Route
            path="/tours/:tourId"
            element={
              <>
                <TourDetails />
                <Footer />
              </>
            }
          />
          <Route
            path="/tours/:tourId/booking"
            element={
              <>
                <TourBooking />
                <Footer />
              </>
            }
          />
          {/* Test route for booking page */}
          <Route
            path="/test-booking"
            element={
              <>
                <TourBooking />
                <Footer />
              </>
            }
          />
          <Route
            path="/tours/:tourId/inquiry"
            element={
              <>
                <InquiryPage />
                <Footer />
              </>
            }
          />

          {/* Standalone inquiry route for testing */}
          <Route
            path="/inquiry"
            element={
              <>
                <InquiryPage />
                <Footer />
              </>
            }
          />

          {/* Room inquiry */}
          <Route
            path="/rooms/:roomId/inquiry"
            element={
              <>
                <RoomInquiry />
                <Footer />
              </>
            }
          />

          {/* activities booking */}
          <Route
            path="/activities"
            element={
              <>
                <Activities />
                <Footer />
              </>
            }
          />
          <Route
            path="/activities/:id"
            element={
              <>
                <ActivityDetail />
                <Footer />
              </>
            }
          />
          <Route
            path="/activities/:id/booking"
            element={
              <>
                <ActivityBookingRequest />
                <Footer />
              </>
            }
          />

          {/* user profile - AUTHENTICATION RE-ENABLED */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
                <Footer />
              </ProtectedRoute>
            }
          />

          {/* admin only - AUTHENTICATION RE-ENABLED */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/activities"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminActivities />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/activities/bookings"
            element={
              <ProtectedRoute requireAdmin={true}>
                <ActivityBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/activities/new"
            element={
              <ProtectedRoute requireAdmin={true}>
                <ActivityForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/activities/:id/edit"
            element={
              <ProtectedRoute requireAdmin={true}>
                <ActivityForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/activities/:id/view"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminActivityView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/activities/:id"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminActivityDetail />
              </ProtectedRoute>
            }
          />

          {/* catch‑all */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Suspense>
  );
}
