import React, { lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import LandingHeader from './Landing/LandingHeader';
import Footer from './Components/Footer';
import WhatsappIcon from './Components/WhatsappIcon';

// AUTHENTICATION DISABLED - ProtectedRoute import commented out
// import ProtectedRoute from './Components/ProtectedRoute';

const Home          = lazy(() => import('./Landing/Home'));
const Login         = lazy(() => import('./Landing/Login'));
const Register      = lazy(() => import('./Landing/Register'));
const Account       = lazy(() => import('./pages/Account'));
const Search        = lazy(() => import('./pages/Search'));
const BookingRequest= lazy(() => import('./pages/BookingRequest'));
const ActivityBookingRequest = lazy(() => import('./pages/ActivityBookingRequest'));
const ContactForm   = lazy(() => import('./pages/ContactForm'));
const HotelProfile  = lazy(() => import('./pages/HotelProfile'));
const RoomProfile   = lazy(() => import('./pages/RoomProfile'));
const UserProfile   = lazy(() => import('./pages/UserProfile'));
const Bookings      = lazy(() => import('./pages/Bookings'));
const SpecialOffers = lazy(() => import('./pages/SpecialOffers'));
const Settings      = lazy(() => import('./pages/Settings'));
const AdminPanel    = lazy(() => import('./pages/AdminPanel'));
const Tours         = lazy(() => import('./pages/Tours'));
const TourDetails   = lazy(() => import('./pages/TourDetails'));
const Activities    = lazy(() => import('./pages/Activities'));
const ActivityDetail = lazy(() => import('./pages/ActivityDetail'));
const ActivityForm  = lazy(() => import('./pages/admin/ActivityForm'));
const AdminActivityDetail = lazy(() => import('./pages/admin/ActivityDetail'));
const AdminActivityView = lazy(() => import('./pages/admin/AdminActivityView'));
const AdminActivities = lazy(() => import('./pages/admin/Activities'));

// point axios at your API & send cookies by default
axios.defaults.baseURL = 'http://localhost:5001/api';
axios.defaults.withCredentials = true;

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <Suspense fallback={<div className="text-center py-10">Loading…</div>}>
      {/* Only show LandingHeader if not on admin route */}
      {!isAdminRoute && <LandingHeader />}
      <div style={{ paddingTop: !isAdminRoute ? '80px' : '0px' }}>
        <Routes>
          {/* public */}
          <Route path="/"       element={<><Home/><Footer/></>} />
          <Route path="/login"  element={<><Login/><Footer/></>} />
          <Route path="/register" element={<><Register/><Footer/></>} />
          <Route path="/account" element={<><Account/><Footer/></>} />

          {/* pages without sidebar */}
          <Route path="/contact"        element={<><ContactForm/><Footer/></>} />
          <Route path="/search"         element={<><Search/><Footer/></>} />
          <Route path="/special-offers" element={<><SpecialOffers/><Footer/></>} />

          {/* protected - AUTHENTICATION DISABLED, all routes now accessible */}
          <Route path="/settings" element={<><Settings/><Footer/></>} />
          <Route path="/bookings" element={<><Bookings/><Footer/></>} />
          <Route path="/bookingRequest" element={<><BookingRequest/><Footer/></>} />

          {/* hotel search */}

          {/* hotel/room profiles */}
          <Route path="/hotels/:hotelId" element={<><HotelProfile/><Footer/></>} />
          <Route path="/hotels/:hotelId/rooms/:roomId" element={<><RoomProfile/><Footer/></>} />

          {/* tour search */}
          <Route path="/tours" element={<><Tours/><Footer/></>} />

          {/* tour packages */}
          <Route path="/tours/:tourId" element={<><TourDetails/><Footer/></>} />

          {/* activities booking */}
          <Route path="/activities" element={<><Activities/><Footer/></>} />
          <Route path="/activities/:id" element={<><ActivityDetail/><Footer/></>} />
          <Route path="/activities/:id/booking" element={<><ActivityBookingRequest/><Footer/></>} />

          {/* user profile - AUTHENTICATION DISABLED */}
          <Route path="/profile" element={<><UserProfile/><Footer/></>} />

          {/* admin only - AUTHENTICATION DISABLED, now accessible to all */}
          <Route path="/admin" element={<AdminPanel/>} />
          <Route path="/admin/activities" element={<AdminActivities />} />
          <Route path="/admin/activities/new" element={<ActivityForm/>} />
          <Route path="/admin/activities/:id/edit" element={<ActivityForm/>} />
          <Route path="/admin/activities/:id/view" element={<AdminActivityView/>} />
          <Route path="/admin/activities/:id" element={<AdminActivityDetail/>} />

          {/* catch‑all */}
          <Route path="*" element={<Home/>} />
        </Routes>
      </div>
      <WhatsappIcon />
    </Suspense>
  );
}
