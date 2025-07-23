// Components/HotelCard.jsx
import React from 'react';
import { Heart, Star } from 'lucide-react';

const HotelCard = ({ hotel, onClick, isFavorite, onFavoriteToggle, availbleNoOfRooms }) => (
  <div
    className="rounded-3xl bg-white shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer border border-gray-100"
    onClick={onClick}
  >
    <div className="relative h-56 sm:h-64">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
      <img
        src={hotel.gallery[0]}
        alt={hotel.name}
        className="w-full h-full object-cover"
      />
      {hotel.limited && (
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-[#005E84] text-white px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full z-20">
          Limited
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-20">
        <h4 className="font-bold text-lg sm:text-xl text-white line-clamp-1">{hotel.name}</h4>
        <p className="text-white/90 text-xs sm:text-sm flex items-center">
          <svg className="h-3 sm:h-4 w-3 sm:w-4 mr-1 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {hotel.location}
        </p>
      </div>
    </div>
    <div className="p-4 sm:p-5">
      <p className="text-gray-700 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{hotel.description}</p>
      {availbleNoOfRooms !== undefined && (
        <div className="mx-auto relative mb-2 sm:mb-3 bg-green-600/85 text-white w-fit px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full z-20">
          {availbleNoOfRooms} {availbleNoOfRooms === 1 ? 'Room' : 'Rooms'} Available
        </div>
      )}
      <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-200">
        <div className="flex items-center mb-1">
          {[1, 2, 3, 4, 5].map(star => (
            <Star
              key={star}
              className={`h-3 sm:h-4 w-3 sm:w-4 mr-0.5 ${star <= (hotel.starRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
            />
          ))}
          <span className="text-xs sm:text-sm text-gray-500 ml-1">({hotel.starRating || 0})</span>
        </div>
        <div className="bg-[#B7C5C7] hover:bg-[#c6d1d2] rounded-full px-3 sm:px-4 py-1 transition-colors duration-300 min-h-[36px] flex items-center">
          <span className="text-[#005E84] font-medium text-xs sm:text-sm">View</span>
        </div>
      </div>
    </div>
  </div>
);

export default HotelCard;