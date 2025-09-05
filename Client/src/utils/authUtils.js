// Utility functions for authentication

/**
 * Check if there are any authentication-related cookies
 * This helps avoid unnecessary API calls when user is not logged in
 */
export const hasAuthCookies = () => {
  const cookies = document.cookie;
  return cookies.includes('token=') || cookies.includes('auth') || cookies.includes('session');
};

/**
 * Check if the current page/route requires authentication
 */
export const isProtectedRoute = (pathname) => {
  const protectedPaths = [
    '/profile',
    '/settings', 
    '/bookings',
    '/bookingRequest',
    '/admin'
  ];
  
  return protectedPaths.some(path => pathname.startsWith(path));
};

/**
 * Check if the current route is an admin route
 */
export const isAdminRoute = (pathname) => {
  return pathname.startsWith('/admin');
};
