// src/components/SearchResultsList.jsx
import React from 'react';
import { Box, Typography } from '@mui/material';
import HotelCard from '../Components/HotelCard';

const SearchResultsList = ({
  loading,
  searchResults,
  handlePropertyClick,
  toggleFavorite,
  favorites,
  setShowFilters
}) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Box id="property-section" sx={{ mb: { xs: 4, sm: 6, md: 8, lg: 12 } }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 lg:mb-8">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-0">
          Available Resorts
        </h3>
        <span className="text-lapis_lazuli font-medium text-sm sm:text-base">
          {searchResults.length} resorts found
        </span>
      </div>

      {searchResults.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-md p-4 sm:p-8 text-center border border-gray-200">
          <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            No resorts match your search criteria
          </h4>
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Try adjusting your filters or search for a different hotel/resort name
          </p>
          <button
            onClick={() => setShowFilters(true)}
            className="bg-lapis_lazuli text-white px-4 sm:px-6 py-2 text-sm sm:text-base rounded-lg font-semibold hover:bg-indigo_dye transition-colors shadow-md"
          >
            Modify Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {searchResults.map(p => (
            <div key={p._id} className="flex w-full">
              <HotelCard
                hotel={p}
                availbleNoOfRooms={p.rooms.length}
                onClick={() => handlePropertyClick(p._id)}
                onFavoriteToggle={() => toggleFavorite(p._id)}
                isFavorite={Boolean(favorites[p._id])}
              />
            </div>
          ))}
        </div>
      )}
    </Box>
  );
};

export default SearchResultsList;
