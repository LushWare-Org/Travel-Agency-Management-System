const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
    next();
  } catch (err) {
    // Check if error is due to token expiration
    if (err.name === 'TokenExpiredError') {
      // Clear the expired token
      res.clearCookie('token');
      return res.status(401).json({ 
        msg: 'Token has expired. Please log in again.',
        expired: true
      });
    }
    
    // Handle other token validation errors
    res.status(401).json({ msg: 'Token is not valid' });
  }
};