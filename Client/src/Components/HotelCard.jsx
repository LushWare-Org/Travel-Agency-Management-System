// Components/HotelCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

const HotelCard = ({ hotel, onClick, isFavorite, onFavoriteToggle, availbleNoOfRooms }) => (
  <motion.div
    className="rounded-3xl bg-white shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl cursor-pointer border border-gray-100"
    onClick={onClick}
    whileHover={{ y: -8 }}
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="relative h-56 sm:h-64">
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10" />
      <motion.img
        src={hotel.gallery[0]}
        alt={hotel.name}
        className="w-full h-full object-cover transition-transform duration-500"
        whileHover={{ scale: 1.05 }}
      />
      {hotel.limited && (
        <motion.div 
          className="absolute top-2 sm:top-3 left-2 sm:left-3 z-20"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#005E84]/90 text-white backdrop-blur-sm">
            Limited
          </span>
        </motion.div>
      )}
      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-20">
        <motion.h4 
          className="font-bold text-lg sm:text-xl text-white line-clamp-1 mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {hotel.name}
        </motion.h4>
        <motion.p 
          className="text-gray-200 text-xs sm:text-sm flex items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <svg className="h-3 sm:h-4 w-3 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {hotel.location}
        </motion.p>
      </div>
    </div>
    <motion.div 
      className="p-4 sm:p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7, duration: 0.5 }}
    >
      {/* Description */}
      <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
        {hotel.description}
      </p>
      
      {/* Available Rooms */}
      {availbleNoOfRooms !== undefined && (
        <div className="mx-auto relative mb-2 sm:mb-3 bg-[#005E84] text-white w-fit px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium rounded-full z-20">
          {availbleNoOfRooms} {availbleNoOfRooms === 1 ? 'Room' : 'Rooms'} Available
        </div>
      )}
      
      {/* Star Rating and Action */}
      <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-gray-100">
        <div className="flex items-center mb-1">
          {[1, 2, 3, 4, 5].map(star => (
            <svg
              key={star}
              className="h-3 sm:h-4 w-3 sm:w-4 mr-0.5"
              viewBox="0 0 24 24"
              fill={star <= (hotel.starRating || 0) ? "#005E84" : "#E0E0E0"}
            >
              <polygon
                points="12,2 15,9 22,9.3 17,14 18.5,21 12,17.5 5.5,21 7,14 2,9.3 9,9"
                stroke="#0A435C"
                strokeLinejoin="round"
                strokeWidth="1.2"
              />
            </svg>
          ))}
          <span className="text-xs sm:text-sm text-gray-500 ml-1">({hotel.starRating || 0})</span>
        </div>
        
        <motion.div 
          className="bg-[#005E84] hover:bg-[#0A435C] rounded-full px-3 sm:px-4 py-2 transition-colors duration-300 flex items-center"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-white font-medium text-xs sm:text-sm">View Details</span>
        </motion.div>
      </div>
    </motion.div>
  </motion.div>
);

export default HotelCard;