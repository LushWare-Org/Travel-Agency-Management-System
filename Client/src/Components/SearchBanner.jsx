// src/components/SearchBanner.jsx
import React from 'react';

const SearchBanner = () => {
  return (
    <header
      className="bg-cover bg-center h-32 sm:h-40 lg:h-60 shadow-lg rounded-2xl overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, rgba(10,67,92,0.5), rgba(10,67,92,0.5)), url('https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1920')"
      }}
    >
      <div className="flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h1 className="text-lg sm:text-xl lg:text-3xl font-extrabold drop-shadow-md">
          Discover Paradise
        </h1>
        <p className="text-xs sm:text-sm mt-2 drop-shadow-md max-w-md px-4">
          Find your perfect Maldives getaway with exclusive B2B rates
        </p>
      </div>
    </header>
  );
};

export default SearchBanner;
