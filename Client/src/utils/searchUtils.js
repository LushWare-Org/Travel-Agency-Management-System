// src/utils/searchUtils.js

/**
 * Safe object property access helper
 * @param {Object} obj - The object to access
 * @param {string} path - The path to the property (dot-separated)
 * @returns {*} The value at the path or null if not found
 */
export const safeAccess = (obj, path) => {
  if (!obj || !path) return null;
  return path.split('.').reduce((acc, part) => (acc && acc[part] ? acc[part] : null), obj);
};

/**
 * Initial search parameters
 */
export const INITIAL_PARAMS = {
  destination: '',
  checkIn: null,
  checkOut: null,
  nationality: '',
  mealPlan: '',
  rooms: 1,
  adults: 2,
  children: 0,
  childrenAges: [],
  priceRange: [0, 0],
  starRating: 0,
  sortBy: 'price_low',
};

/**
 * Calculate room price including surcharge for nationality
 * @param {Object} room - The room object
 * @param {string} nationality - The nationality for surcharge calculation
 * @returns {number} The total room price
 */
export const getRoomPrice = (room, nationality) => {
  if (!room) return 0;
  const surcharge = safeAccess(room, 'prices')?.find(p => p?.country === nationality)?.price || 0;
  return Number(room.basePrice || 0) + surcharge;
};
