import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';

import ProtectedRoute from './Components/ProtectedRoute';
import SidebarLayout from './Components/SidebarLayout'; // if you abstracted it
import Footer from './Components/Footer';

const Home          = lazy(() => import('./Landing/Home'));
const Login         = lazy(() => import('./Landing/Login'));
const Register      = lazy(() => import('./Landing/Register'));
const Search        = lazy(() => import('./pages/Search'));
const BookingRequest= lazy(() => import('./pages/BookingRequest'));
const ContactForm   = lazy(() => import('./pages/ContactForm'));
const HotelProfile  = lazy(() => import('./pages/HotelProfile'));
const RoomProfile   = lazy(() => import('./pages/RoomProfile'));
const UserProfile   = lazy(() => import('./pages/UserProfile'));
const Bookings      = lazy(() => import('./pages/Bookings'));
const SpecialOffers = lazy(() => import('./pages/SpecialOffers'));
const Settings      = lazy(() => import('./pages/Settings'));
const AdminPanel    = lazy(() => import('./pages/AdminPanel'));
const Tours = lazy(() => import('./pages/Tours'));
const TourDetails = lazy(() => import('./pages/TourDetails'));

// point axios at your API & send cookies by default
axios.defaults.baseURL = 'https://api.yomaldives.live/api';
axios.defaults.withCredentials = true;

export default function App() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading…</div>}>
      <Routes>
        {/* public */}
        <Route path="/"       element={<><Home/><Footer/></>} />
        <Route path="/login"  element={<><Login/><Footer/></>} />
        <Route path="/register" element={<><Register/><Footer/></>} />

        {/* sidebar pages (public) */}
        <Route path="/contact"        element={<SidebarLayout><ContactForm/></SidebarLayout>} />
        <Route path="/search"         element={<SidebarLayout><Search/></SidebarLayout>} />
        <Route path="/special-offers" element={<SidebarLayout><SpecialOffers/></SidebarLayout>} />

        {/* protected */}
        <Route path="/settings" element={
          <ProtectedRoute>
            <SidebarLayout><Settings/></SidebarLayout>
          </ProtectedRoute>
        } />
        <Route path="/bookings" element={
          <ProtectedRoute>
            <SidebarLayout><Bookings/></SidebarLayout>
          </ProtectedRoute>
        }/>

        <Route path="/bookingRequest" element={
          <ProtectedRoute>
            <SidebarLayout><BookingRequest/></SidebarLayout>
          </ProtectedRoute>
        }/>

        {/* hotel search */}

        {/* hotel/room profiles */}
        <Route path="/hotels/:hotelId" element={<SidebarLayout><HotelProfile/></SidebarLayout>} />
        <Route path="/hotels/:hotelId/rooms/:roomId" element={
          <ProtectedRoute>
            <SidebarLayout><RoomProfile/></SidebarLayout>
          </ProtectedRoute>
        }/>

        {/* tour search */}
        <Route path="/tours" element={
          <ProtectedRoute>
            <SidebarLayout><Tours/></SidebarLayout>
          </ProtectedRoute>
        }/>

        {/* tour packages */}
        <Route path="/tours/:tourId" element={
          <ProtectedRoute>
            <SidebarLayout><TourDetails/></SidebarLayout>
          </ProtectedRoute>
        } />

        {/* user profile */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <SidebarLayout><UserProfile/></SidebarLayout>
          </ProtectedRoute>
        }/>

        {/* admin only */}
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin>
            <AdminPanel/>
          </ProtectedRoute>
        }/>

        {/* catch‑all */}
        <Route path="*" element={<Home/>} />
      </Routes>
    </Suspense>
  );
}
