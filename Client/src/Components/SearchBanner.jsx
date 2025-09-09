// src/components/SearchBanner.jsx
import React from 'react';
import { motion } from 'framer-motion';

const SearchBanner = () => {
  return (
    <motion.header
      className="bg-cover bg-center h-32 sm:h-40 lg:h-60 shadow-lg rounded-2xl overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(10,67,92,0.5), rgba(10,67,92,0.5)), url('/travel-services/mike-swigunski-k9Zeq6EH_bk-unsplash.jpg')"
      }}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex flex-col items-center justify-center h-full text-white text-center px-4">
        <motion.h1 
          className="text-lg sm:text-xl lg:text-3xl font-extrabold drop-shadow-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Maldives Luxury Resorts
        </motion.h1>
        <motion.p 
          className="text-xs sm:text-sm mt-2 drop-shadow-md max-w-md px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Indulge in world-class luxury resorts offering unparalleled comfort and breathtaking island views
        </motion.p>
      </div>
    </motion.header>
  );
};

export default SearchBanner;
