// src/components/SearchBanner.jsx
import React from 'react';
import { motion } from 'framer-motion';

const SearchBanner = () => {
  return (
    <motion.header
      className="bg-cover bg-center h-32 sm:h-40 lg:h-60 shadow-lg rounded-2xl overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(10,67,92,0.5), rgba(10,67,92,0.5)), url('https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1920')"
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
          Maldives Tour Packages
        </motion.h1>
        <motion.p 
          className="text-xs sm:text-sm mt-2 drop-shadow-md max-w-md px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Discover paradise with our exclusive tour packages and unforgettable experiences
        </motion.p>
      </div>
    </motion.header>
  );
};

export default SearchBanner;
