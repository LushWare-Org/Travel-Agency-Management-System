import React from 'react';
import { FaBed, FaShip, FaPlane, FaCar, FaPlaneDeparture } from 'react-icons/fa';

const RoomCard = ({ room, onSelect }) => {
  const {
    _id,
    gallery,
    roomName,
    size,
    bedType,
    maxOccupancy: { adults, children },
    amenities,
    transportations,
    searchDates,
    pricePeriods
  } = room;

  const calculatePrice = () => {
    if (!pricePeriods?.length) return { currentPrice: 0, totalPrice: 0, nights: 0 };

    let nights = 1;
    if (searchDates?.checkIn && searchDates?.checkOut) {
      const checkIn = new Date(searchDates.checkIn);
      const checkOut = new Date(searchDates.checkOut);
      if (!isNaN(checkIn.getTime()) && !isNaN(checkOut.getTime()) && checkIn < checkOut) {
        nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      }
    }

    const checkInDate = searchDates?.checkIn ? new Date(searchDates.checkIn) : new Date();
    const applicablePeriod = pricePeriods
      .filter(period => {
        const start = new Date(period.startDate);
        const end = new Date(period.endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        return start <= checkInDate && end >= checkInDate;
      })
      .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))[0];

    const currentPrice = applicablePeriod?.price || 0;
    return {
      currentPrice,
      totalPrice: currentPrice * nights,
      nights
    };
  };

  const { currentPrice, totalPrice, nights } = calculatePrice();

  const getTransportIcon = (method) => {
    const lowerMethod = method.toLowerCase();
    if (lowerMethod.includes('boat') || lowerMethod.includes('ship')) return <FaShip className="text-lapis_lazuli" />;
    if (lowerMethod.includes('plane') && !lowerMethod.includes('domestic')) return <FaPlane className="text-lapis_lazuli" />;
    if (lowerMethod.includes('domestic flight')) return <FaPlaneDeparture className="text-lapis_lazuli" />;
    return <FaCar className="text-lapis_lazuli" />;
  };

  const getTransportType = (type) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes('arrival') || lowerType.includes('pickup')) return 'Arrival';
    if (lowerType.includes('departure') || lowerType.includes('return')) return 'Departure';
    if (lowerType.includes('domestic')) return 'Domestic';
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  return (
    <div className="bg-platinum-500 rounded-xl overflow-hidden border border-platinum-400 shadow-lg hover:shadow-xl transition-all duration-300 h-auto">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-60 md:h-auto overflow-hidden">
          <img
            src={gallery[0] || "/placeholder.jpg"}
            alt={roomName}
            className="w-full h-40 sm:h-48 md:h-full object-cover"
          />
        </div>
        <div className="flex-1 p-4 sm:p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-platinum-100 mb-2 sm:mb-3">{roomName}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="bg-platinum-400 p-2 sm:p-3 rounded-lg text-center">
                <p className="text-platinum-200 text-xs sm:text-sm mb-1">Size</p>
                <p className="font-semibold text-xs sm:text-sm">{size} m²</p>
              </div>
              <div className="bg-platinum-400 p-2 sm:p-3 rounded-lg text-center">
                <p className="text-platinum-200 text-xs sm:text-sm mb-1">Bed</p>
                <p className="font-semibold text-xs sm:text-sm">{bedType}</p>
              </div>
              <div className="bg-platinum-400 p-2 sm:p-3 rounded-lg text-center">
                <p className="text-platinum-200 text-xs sm:text-sm mb-1">Adults</p>
                <p className="font-semibold text-xs sm:text-sm">{adults}</p>
              </div>
              <div className="bg-platinum-400 p-2 sm:p-3 rounded-lg text-center">
                <p className="text-platinum-200 text-xs sm:text-sm mb-1">Children</p>
                <p className="font-semibold text-xs sm:text-sm">{children}</p>
              </div>
            </div>
            {transportations && transportations.length > 0 && (
              <div className="mb-2 sm:mb-3">
                {transportations.map((t, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-ash_gray-500 text-indigo_dye-500 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm w-fit mb-1">
                    {getTransportIcon(t.method)}
                    <span>
                      {getTransportType(t.type)}: {t.method}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-2 mb-2 sm:mb-3">
              {amenities.map((amenity, idx) => (
                <span
                  key={idx}
                  className="bg-ash_gray-500 text-indigo_dye-500 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md text-xs sm:text-sm"
                >
                  {amenity}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-platinum-400 pt-3 sm:pt-4 mt-3 sm:mt-0">
            <div className="mb-6 sm:mb-0">
              <p className="text-platinum-200 text-xs sm:text-sm">${currentPrice} × {nights} {nights === 1 ? 'night' : 'nights'}</p>
              <p className="text-sm sm:text-xl md:text-2xl font-bold text-lapis_lazuli-500">
                Total: ${totalPrice}
              </p>
            </div>
            <button
              onClick={() => onSelect(_id)}
              className="bg-lapis_lazuli-500 hover:bg-indigo_dye-500 text-platinum-900 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-md hover:shadow-lg w-full sm:w-auto text-xs sm:text-sm min-h-[44px]"
            >
              <FaBed className="w-4 sm:w-5 h-4 sm:h-5" />
              Book This Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;