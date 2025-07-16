import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Components/Header';
import Footer from '../Components/Footer';
import OfferCard from '../Components/OfferCard';
import axios from 'axios';

const SpecialOffers = ({ sidebarOpen }) => {
  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState([]);
  const [userBookings, setUserBookings] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all required data in parallel
        const [offersRes, bookingsRes, userRes] = await Promise.all([
          axios.get('/discounts'),
          axios.get('/bookings/my'),
          axios.get('/users/me')
        ]);

        setOffers(offersRes.data);
        setUserBookings(bookingsRes.data);
        setUser(userRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort offers based on type and conditions
  const getApplicableOffers = () => {
    const today = new Date();
    const userBookingCount = userBookings.length;

    return offers
      .filter(offer => {
        // Check if offer is active
        if (!offer.active) return false;
        
        // Check if offer is within valid date range
        const validFrom = offer.validFrom ? new Date(offer.validFrom) : null;
        const validTo = offer.validTo ? new Date(offer.validTo) : null;
        
        if (validFrom && today < validFrom) return false;
        if (validTo && today > validTo) return false;

        // Check specific conditions based on offer type
        switch (offer.discountType) {
          case 'transfer':
            return offer.conditions.minStayDays ? offer.conditions.minStayDays >= 5 : true;
          case 'exclusive':
            return offer.conditions.minBookings ? userBookingCount >= offer.conditions.minBookings : true;
          case 'libert':
            return offer.conditions.isDefault;
          case 'seasonal':
            // For seasonal offers, check if current date is within the seasonal period
            const currentMonth = today.getMonth() + 1; // JavaScript months are 0-based
            return offer.conditions.seasonalMonths ? 
              offer.conditions.seasonalMonths.includes(currentMonth) : true;
          case 'percentage':
            return true; // Percentage offers are always applicable if active and within date range
          default:
            return true;
        }
      })
      .sort((a, b) => {
        // Sort order: exclusive > transfer > seasonal/percentage > libert
        const typePriority = {
          exclusive: 4,
          transfer: 3,
          seasonal: 2,
          percentage: 2,
          libert: 1
        };
        return typePriority[b.discountType] - typePriority[a.discountType];
      });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  const applicableOffers = getApplicableOffers();

  return (
    <div className={`flex-1 overflow-y-auto bg-gray-100 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-16'} ml-0`}>
      <Navigation isAuthenticated={true} isAdmin={false} onLogout={() => navigate('/login')} />
      <main className="px-4 md:px-8 py-6 md:py-10 max-w-3xl md:max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-6 md:mb-10">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Special Offers</h1>
          <p className="text-gray-600 mt-1 md:mt-2 text-sm md:text-base">
            Discover our latest exclusive offers and promotions tailored for B2B partners.
          </p>
          {user && (
            <div className="mt-3 md:mt-4 bg-indigo-50 p-3 md:p-4 rounded-lg border border-indigo-100">
              <p className="text-indigo-800 text-xs md:text-sm">
                <span className="font-semibold">Your Booking Count:</span> {userBookings.length} bookings
              </p>
              <p className="text-indigo-800 mt-1 text-xs md:text-sm">
                <span className="font-semibold">Your Status:</span> {userBookings.length >= 25 ? 'Exclusive Agent' : 'Regular Agent'}
              </p>
            </div>
          )}
        </header>

        {/* Offers List */}
        <div className="space-y-4 md:space-y-6">
          {applicableOffers.length > 0 ? (
            applicableOffers.map((offer) => (
              <OfferCard 
                key={offer._id} 
                offer={offer} 
                userBookingsCount={userBookings.length}
                currentUserId={user?._id}
                allOffers={applicableOffers}
                className="w-full"
              />
            ))
          ) : (
            <div className="text-center py-12 md:py-16 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-gray-500 text-base md:text-lg">No active offers available at the moment</p>
              <p className="text-gray-400 text-xs md:text-sm mt-1 md:mt-2">Check back soon for new promotions</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SpecialOffers;