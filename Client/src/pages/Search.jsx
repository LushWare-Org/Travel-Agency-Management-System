// src/pages/Search.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import { useHotelSearch } from '../hooks/useHotelSearch';
import SearchBanner from '../components/SearchBanner';
import SearchForm from '../components/SearchForm';
import SearchResultsList from '../components/SearchResultsList';

const Search = () => {
  const location = useLocation();
  
  const {
    loading,
    searchResults,
    searchParams,
    globalPriceRange,
    hotels,
    dateRange,
    setDateRange,
    datePickerRef,
    destinationSearch,
    setDestinationSearch,
    showDestinationDropdown,
    setShowDestinationDropdown,
    selectedDestination,
    setSelectedDestination,
    countrySearch,
    setCountrySearch,
    showCountryDropdown,
    setShowCountryDropdown,
    selectedCountry,
    setSelectedCountry,
    showFilters,
    setShowFilters,
    favorites,
    handleInputChange,
    handleChildrenChange,
    handleChildAgeChange,
    handlePriceRangeChange,
    handleSearch,
    handleReset,
    handlePropertyClick,
    toggleFavorite,
    calculatePriceRangeStyles,
  } = useHotelSearch(location);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-platinum via-ash_gray to-platinum flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-lapis_lazuli/20 border-t-lapis_lazuli rounded-full mx-auto mb-4"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <svg className="w-6 h-6 text-lapis_lazuli" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lapis_lazuli font-medium text-lg"
          >
            Discovering your perfect getaway...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div>
        <main className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10 max-w-[1400px] mx-auto">
          {/* Banner */}
          <SearchBanner />

          {/* Search Form */}
          <SearchForm
            searchParams={searchParams}
            dateRange={dateRange}
            setDateRange={setDateRange}
            datePickerRef={datePickerRef}
            hotels={hotels}
            destinationSearch={destinationSearch}
            setDestinationSearch={setDestinationSearch}
            showDestinationDropdown={showDestinationDropdown}
            setShowDestinationDropdown={setShowDestinationDropdown}
            selectedDestination={selectedDestination}
            setSelectedDestination={setSelectedDestination}
            countrySearch={countrySearch}
            setCountrySearch={setCountrySearch}
            showCountryDropdown={showCountryDropdown}
            setShowCountryDropdown={setShowCountryDropdown}
            selectedCountry={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            globalPriceRange={globalPriceRange}
            handleInputChange={handleInputChange}
            handleChildrenChange={handleChildrenChange}
            handleChildAgeChange={handleChildAgeChange}
            handlePriceRangeChange={handlePriceRangeChange}
            handleSearch={handleSearch}
            handleReset={handleReset}
            calculatePriceRangeStyles={calculatePriceRangeStyles}
          />

          {/* Search Results */}
          <SearchResultsList
            loading={loading}
            searchResults={searchResults}
            handlePropertyClick={handlePropertyClick}
            toggleFavorite={toggleFavorite}
            favorites={favorites}
            setShowFilters={setShowFilters}
          />
        </main>
      </div>
    </div>
  );
};

export default Search;