import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import LandingHeader from "./Landing/LandingHeader";
import Footer from "./Components/Footer";
import WhatsappIcon from "./Components/WhatsappIcon";

// AUTHENTICATION DISABLED - ProtectedRoute import commented out
// import ProtectedRoute from './Components/ProtectedRoute';

const Home = lazy(() => import("./Landing/Home"));
const Login = lazy(() => import("./Landing/Login"));
const Register = lazy(() => import("./Landing/Register"));
const Search = lazy(() => import("./pages/Search"));
const BookingRequest = lazy(() => import("./pages/BookingRequest"));
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
const Activities = lazy(() => import("./pages/Activities"));
const TravelServices = lazy(() => import("./pages/TravelServices"));
const RealEstate = lazy(() => import("./pages/RealEstate"));
const InvestmentSupport = lazy(() => import("./pages/InvestmentSupport"));
const BrandRepresentation = lazy(() => import("./pages/BrandRepresentation"));
const AboutUs = lazy(() => import("./pages/AboutUs"));

// point axios at your API & send cookies by default
axios.defaults.baseURL = "http://localhost:5001/api";
axios.defaults.withCredentials = true;

export default function App() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading…</div>}>
      <LandingHeader />
      <div style={{ paddingTop: "80px" }}>
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

          {/* protected - AUTHENTICATION DISABLED, all routes now accessible */}
          <Route
            path="/settings"
            element={
              <>
                <Settings />
                <Footer />
              </>
            }
          />
          <Route
            path="/bookings"
            element={
              <>
                <Bookings />
                <Footer />
              </>
            }
          />
          <Route
            path="/bookingRequest"
            element={
              <>
                <BookingRequest />
                <Footer />
              </>
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

          {/* user profile - AUTHENTICATION DISABLED */}
          <Route
            path="/profile"
            element={
              <>
                <UserProfile />
                <Footer />
              </>
            }
          />

          {/* admin only - AUTHENTICATION DISABLED, now accessible to all */}
          <Route path="/admin" element={<AdminPanel />} />

          {/* static informational pages */}
          <Route
            path="/travel-services"
            element={
              <>
                <TravelServices />
                <Footer />
              </>
            }
          />
          <Route
            path="/real-estate"
            element={
              <>
                <RealEstate />
                <Footer />
              </>
            }
          />
          <Route
            path="/investment-support"
            element={
              <>
                <InvestmentSupport />
                <Footer />
              </>
            }
          />
          <Route
            path="/brand-representation"
            element={
              <>
                <BrandRepresentation />
                <Footer />
              </>
            }
          />
          <Route
            path="/about-us"
            element={
              <>
                <AboutUs />
                <Footer />
              </>
            }
          />

          {/* catch‑all */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
      <WhatsappIcon />
    </Suspense>
  );
}
