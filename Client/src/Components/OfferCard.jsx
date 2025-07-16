import React, { useState } from 'react';
import axios from 'axios';
import { Calendar as CalendarIcon, Tag as TagIcon, Eye as EyeIcon, X as CloseIcon } from 'lucide-react';

// Helper to format dates
const formatDate = dateStr => {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const typeLabels = {
  percentage: 'Percentage',
  seasonal: 'Seasonal',
  exclusive: 'Exclusive',
  transportation: 'Transportation Offer',
  libert: 'Libert'
};

const OfferCard = ({ offer, userBookingsCount = 0, currentUserId, allOffers }) => {
  const {
    _id,
    discountType,
    value,
    description,
    conditions = {},
    validFrom,
    validTo,
    applicableHotels = [],
    active,
    imageURL,
    eligibleAgents = [],
    usedAgents = []
  } = offer;

  const [showHotels, setShowHotels] = useState(false);
  const [hotelNames, setHotelNames] = useState([]);
  const [hotelFetchError, setHotelFetchError] = useState(null);

  // Fetch hotel names by ID on first expand
  const handleToggleHotels = async () => {
    if (!showHotels && hotelNames.length === 0 && applicableHotels.length > 0) {
      try {
        const names = await Promise.all(
          applicableHotels.map(id =>
            axios.get(`/hotels/${id}`)
              .then(res => res.data.name)
              .catch(() => 'Unknown Hotel')
          )
        );
        setHotelNames(names);
        setHotelFetchError(null);
      } catch (err) {
        console.error('Error fetching hotel names:', err);
        setHotelFetchError('Failed to load hotel names');
      }
    }
    setShowHotels(prev => !prev);
  };

  // Determine if offer is applicable
  const isApplicable = () => {
    if (!active) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const validFromDate = validFrom ? new Date(validFrom) : null;
    const validToDate = validTo ? new Date(validTo) : null;
    if (validFromDate && today < validFromDate) return false;
    if (validToDate && today > validToDate) return false;
    if (conditions.bookingWindow?.start && conditions.bookingWindow?.end) {
      const bookingStart = new Date(conditions.bookingWindow.start);
      const bookingEnd = new Date(conditions.bookingWindow.end);
      if (today < bookingStart || today > bookingEnd) return false;
    }
    if (conditions.stayPeriod?.start && conditions.stayPeriod?.end) {
      const stayStart = new Date(conditions.stayPeriod.start);
      const stayEnd = new Date(conditions.stayPeriod.end);
      if (today < stayStart || today > stayEnd) return false;
    }
    if (conditions.minNights && (conditions.minNights < 1 || conditions.minNights > 10)) return false;
    switch (discountType) {
      case 'percentage':
        return true;
      case 'seasonal': {
        if (!conditions.seasonalMonths || !Array.isArray(conditions.seasonalMonths)) return false;
        const currentMonth = today.getMonth() + 1;
        return conditions.seasonalMonths.includes(currentMonth);
      }
      case 'exclusive': {
        if (!currentUserId || !eligibleAgents.includes(currentUserId)) return false;
        if (usedAgents.includes(currentUserId)) return false;
        if (applicableHotels.length > 0 && !applicableHotels.includes(window?.selectedHotelId)) return false;
        if (conditions.minBookings && userBookingsCount < conditions.minBookings) return false;
        return true;
      }
      case 'transportation':
        return conditions.minStayDays && userBookingsCount >= 0 && conditions.minStayDays >= 5;
      case 'libert': {
        if (!conditions.isDefault) return false;
        // Only show if no other offer is applicable
        const otherOffersApplicable = allOffers && allOffers.some(o => {
          if (o._id === _id || o.discountType === 'libert') return false;
          if (!o.active) return false;
          const oValidFrom = o.validFrom ? new Date(o.validFrom) : null;
          const oValidTo = o.validTo ? new Date(o.validTo) : null;
          if (oValidFrom && today < oValidFrom) return false;
          if (oValidTo && today > oValidTo) return false;
          if (o.conditions.bookingWindow?.start && o.conditions.bookingWindow?.end) {
            const bs = new Date(o.conditions.bookingWindow.start);
            const be = new Date(o.conditions.bookingWindow.end);
            if (today < bs || today > be) return false;
          }
          if (o.conditions.stayPeriod?.start && o.conditions.stayPeriod?.end) {
            const ss = new Date(o.conditions.stayPeriod.start);
            const se = new Date(o.conditions.stayPeriod.end);
            if (today < ss || today > se) return false;
          }
          if (o.conditions.minNights && (o.conditions.minNights < 1 || o.conditions.minNights > 10)) return false;
          switch (o.discountType) {
            case 'percentage':
              return true;
            case 'seasonal': {
              if (!o.conditions.seasonalMonths || !Array.isArray(o.conditions.seasonalMonths)) return false;
              const currentMonth = today.getMonth() + 1;
              return o.conditions.seasonalMonths.includes(currentMonth);
            }
            case 'exclusive':
              return currentUserId && o.eligibleAgents.includes(currentUserId) &&
                !o.usedAgents.includes(currentUserId) &&
                userBookingsCount >= (o.conditions.minBookings || 1);
            case 'transportation':
              return o.conditions.minStayDays && userBookingsCount >= 0 && o.conditions.minStayDays >= 5;
            default:
              return false;
          }
        });
        return !otherOffersApplicable;
      }
      default:
        return false;
    }
  };

  // Determine display title
  const displayTitle = () => {
    switch (discountType) {
      case 'percentage':
        return `${value}% Off`;
      case 'seasonal':
        return `Seasonal Offer: $${value}`;
      case 'exclusive':
        return `Exclusive Agent Offer: $${value}`;
      case 'transportation':
        return `Transportation Offer: $${value}`;
      case 'libert':
        return `Libert Offer: $${value}`;
      default:
        return typeLabels[discountType] || discountType;
    }
  };

  // Get condition text
  const getConditionText = () => {
    switch (discountType) {
      case 'percentage':
        return conditions.minNights ? `Requires minimum ${conditions.minNights} nights` : null;
      case 'seasonal':
        return conditions.seasonalMonths?.length
          ? `Available for ${conditions.seasonalMonths.map(month =>
              new Date(2000, month - 1, 1).toLocaleString('default', { month: 'long' })
            ).join(', ')}`
          : null;
      case 'exclusive':
        return `Requires ${conditions.minBookings || 1}+ bookings`;
      case 'transportation':
        return `Requires ${conditions.minStayDays || 5}+ stay days`;
      case 'libert':
        return 'Available when no other offers apply';
      default:
        return null;
    }
  };

  // Hide if not applicable
  if (!isApplicable()) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-2xl overflow-hidden shadow-lg mb-10">
      <div className="flex flex-col md:flex-row">
        {/* Details Section */}
        <div className="md:w-2/3 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <span
              className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full shadow-sm ${
                active ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-600'
              }`}
            >
              <TagIcon className="w-4 h-4 mr-1" />
              {typeLabels[discountType] || discountType}
            </span>
            <span className={`text-xs font-semibold uppercase tracking-wide ${active ? 'text-green-100' : 'text-gray-400'}`}>
              {active ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* Title & Description */}
          <h3 className="text-2xl font-bold text-white mb-1 drop-shadow-md">{displayTitle()}</h3>
          {description && <p className="text-indigo-100 mb-4 text-sm">{description}</p>}

          {/* Special Conditions */}
          {getConditionText() && (
            <p className="text-indigo-100 text-sm mb-4 italic">{getConditionText()}</p>
          )}

          {/* Conditions */}
          {(conditions.minNights || conditions.bookingWindow || conditions.stayPeriod) && (
            <ul className="text-indigo-100 text-xs mb-4 list-disc list-inside space-y-1">
              {conditions.minNights && <li>Min nights: {conditions.minNights}</li>}
              {conditions.bookingWindow?.start && conditions.bookingWindow?.end && (
                <li>
                  Booking window: {formatDate(conditions.bookingWindow.start)} - {formatDate(conditions.bookingWindow.end)}
                </li>
              )}
              {conditions.stayPeriod?.start && conditions.stayPeriod?.end && (
                <li>
                  Stay period: {formatDate(conditions.stayPeriod.start)} - {formatDate(conditions.stayPeriod.end)}
                </li>
              )}
            </ul>
          )}

          {/* Validity */}
          <div className="flex items-center text-indigo-100 text-xs mb-4">
            <CalendarIcon className="w-4 h-4 mr-1" />
            <span>Valid: {formatDate(validFrom)} – {formatDate(validTo)}</span>
          </div>

          {/* Hotel List Pop-up */}
          {applicableHotels.length > 0 && (
            <div className="relative inline-block mb-4">
              <button
                onClick={handleToggleHotels}
                className="inline-flex items-center text-indigo-100 text-xs font-medium hover:text-white transition-colors"
              >
                <EyeIcon className="w-4 h-4 mr-1" />
                {`View ${applicableHotels.length} Hotel${applicableHotels.length > 1 ? 's' : ''}`}
              </button>
              {showHotels && (
                <div className="absolute left-32 bottom-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                  <div className="flex justify-end p-1">
                    <button onClick={() => setShowHotels(false)}>
                      <CloseIcon className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                    </button>
                  </div>
                  <ul className="text-gray-800 text-xs p-2 max-h-40 overflow-auto space-y-1">
                    {hotelFetchError ? (
                      <li className="text-red-600">{hotelFetchError}</li>
                    ) : hotelNames.length > 0 ? (
                      hotelNames.map((name, idx) => <li key={idx}>{name}</li>)
                    ) : (
                      <li>Loading...</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Image Section */}
        {imageURL && (
          <div className="md:w-1/3">
            <div className="aspect-[4/3] w-full h-full overflow-hidden">
              <img
                src={imageURL}
                alt={displayTitle()}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferCard;
