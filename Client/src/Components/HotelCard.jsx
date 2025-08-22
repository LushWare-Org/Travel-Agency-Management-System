// Components/HotelCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin, Star, Eye } from 'lucide-react';

const HotelCard = ({ hotel, onClick, isFavorite, onFavoriteToggle, availbleNoOfRooms }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      transition={{ duration: 0.5 }}
      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer border border-platinum-300 hover:shadow-2xl transition-all duration-300"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative h-48 sm:h-56 lg:h-64 overflow-hidden">
        <motion.img
          src={hotel.gallery[0]}
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* Favorite Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle();
          }}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200"
        >
          <Heart
            className={`h-4 w-4 transition-colors duration-200 ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600 hover:text-red-500'
            }`}
          />
        </motion.button>

        {/* Limited Badge */}
        {hotel.limited && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute top-3 left-3 bg-gradient-to-r from-lapis_lazuli to-indigo_dye text-white px-3 py-1 text-xs font-semibold rounded-full shadow-lg"
          >
            Limited Offer
          </motion.div>
        )}

        {/* Hotel Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
          <motion.h4 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-bold text-lg sm:text-xl mb-1 line-clamp-1 drop-shadow-lg"
          >
            {hotel.name}
          </motion.h4>
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-center text-white/90 text-sm"
          >
            <MapPin className="h-3 w-3 mr-1" />
            <span className="line-clamp-1">{hotel.location}</span>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Description */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed"
        >
          {hotel.description}
        </motion.p>

        {/* Available Rooms Badge */}
        {availbleNoOfRooms !== undefined && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
            className="inline-flex items-center bg-gradient-to-r from-ash_gray to-platinum text-indigo_dye px-3 py-1 text-xs font-semibold rounded-full mb-4 shadow-sm"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
            {availbleNoOfRooms} {availbleNoOfRooms === 1 ? 'Room' : 'Rooms'} Available
          </motion.div>
        )}

        {/* Rating and View Button */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {/* Star Rating */}
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="flex items-center"
          >
            <div className="flex items-center mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.div
                  key={star}
                  initial={{ opacity: 0, rotate: -180 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.8 + star * 0.1, duration: 0.3 }}
                >
                  <Star
                    className={`h-4 w-4 ${
                      star <= (hotel.starRating || 0)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-300'
                    } transition-colors duration-200`}
                  />
                </motion.div>
              ))}
            </div>
            <span className="text-sm text-gray-500 font-medium">
              ({hotel.starRating || 0})
            </span>
          </motion.div>

          {/* View Button */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ delay: 0.9 }}
            className="bg-gradient-to-r from-lapis_lazuli to-indigo_dye hover:from-indigo_dye hover:to-indigo_dye2 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 flex items-center space-x-2 group/btn"
          >
            <Eye className="h-4 w-4 group-hover/btn:animate-pulse" />
            <span className="text-sm font-semibold">View Details</span>
          </motion.div>
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0 bg-gradient-to-br from-lapis_lazuli/5 to-indigo_dye/5 pointer-events-none"
      />
    </motion.div>
  );
};

export default HotelCard;