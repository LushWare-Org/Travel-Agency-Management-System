// Utility functions for authentication

/**
 * Check if there are any authentication-related cookies
 * This helps avoid unnecessary API calls when user is not logged in
 */
export const hasAuthCookies = () => {
  const cookies = document.cookie;
  // Check for any potential auth cookies including httpOnly cookies that might be present
  return cookies.length > 0 && (
    cookies.includes('token=') || 
    cookies.includes('auth') || 
    cookies.includes('session') ||
    cookies.includes('jwt') ||
    cookies.includes('access') ||
    cookies.includes('refresh')
  );
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
    '/admin',
    '/staff'
  ];
  
  return protectedPaths.some(path => pathname.startsWith(path));
};

/**
 * Check if the current route is an admin route
 */
export const isAdminRoute = (pathname) => {
  return pathname.startsWith('/admin');
};

/**
 * Check if the current route is a staff route
 */
export const isStaffRoute = (pathname) => {
  return pathname.startsWith('/staff');
};
