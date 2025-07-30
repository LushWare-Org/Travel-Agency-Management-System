// Components/HotelCard.jsx
import React from 'react';
import { Heart } from 'lucide-react';

const HotelCard = ({ hotel, onClick, isFavorite, onFavoriteToggle, availbleNoOfRooms }) => (
  <div
    className="rounded-3xl bg-platinum-500 shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer border border-platinum-400"
    onClick={onClick}
  >
    <div className="relative h-56 sm:h-64">
      <div className="absolute inset-0 bg-gradient-to-t from-indigo_dye-500/70 to-transparent z-10" />
      <img
        src={hotel.gallery[0]}
        alt={hotel.name}
        className="w-full h-full object-cover"
      />
      {hotel.limited && (
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-lapis_lazuli-500 text-platinum-500 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full z-20">
          Limited
        </div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-20">
        <h4 className="font-bold text-lg sm:text-xl text-platinum-500 line-clamp-1">{hotel.name}</h4>
        <p className="text-platinum-400 text-xs sm:text-sm flex items-center">
          <svg className="h-3 sm:h-4 w-3 sm:w-4 mr-1 text-platinum-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {hotel.location}
        </p>
      </div>
    </div>
    <div className="p-4 sm:p-5">
      <p className="text-indigo_dye-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{hotel.description}</p>
      {availbleNoOfRooms !== undefined && (
        <div className="mx-auto relative mb-2 sm:mb-3 bg-indigo_dye-500 text-platinum-500 w-fit px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full z-20">
          {availbleNoOfRooms} {availbleNoOfRooms === 1 ? 'Room' : 'Rooms'} Available
        </div>
      )}
      <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-ash_gray-400">
        <div className="flex items-center mb-1">
          {[1, 2, 3, 4, 5].map(star => (
            <svg
              key={star}
              className="h-3 sm:h-4 w-3 sm:w-4 mr-0.5"
              viewBox="0 0 24 24"
              fill={star <= (hotel.starRating || 0) ? "#2667A4" : "#E0E0E0"} // lapis_lazuli-500 or gray
            >
              <polygon
                points="12,2 15,9 22,9.3 17,14 18.5,21 12,17.5 5.5,21 7,14 2,9.3 9,9"
                stroke="#17406D" // darker shade for border, adjust if needed
                strokeLinejoin="round"
                strokeWidth="1.2"
              />
            </svg>
          ))}
          <span className="text-xs sm:text-sm text-ash_gray-400 ml-1">({hotel.starRating || 0})</span>
        </div>
        <div className="bg-ash_gray-500 hover:bg-ash_gray-600 rounded-full px-3 sm:px-4 py-1 transition-colors duration-300 min-h-[36px] flex items-center">
          <span className="text-lapis_lazuli-500 font-medium text-xs sm:text-sm">View</span>
        </div>
      </div>
    </div>
  </div>
);

export default HotelCard;