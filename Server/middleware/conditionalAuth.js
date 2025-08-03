const jwt = require('jsonwebtoken');

// Middleware that conditionally applies authentication based on booking type
const conditionalAuth = (req, res, next) => {
  const { type } = req.body;
  
  // If it's a booking, require authentication
  if (type === 'booking') {
    const token = req.cookies && req.cookies.token;
    if (!token) {
      return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      };
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        res.clearCookie('token');
        return res.status(401).json({
          msg: 'Token has expired. Please log in again.',
          expired: true
        });
      }
      return res.status(401).json({ msg: 'Token is not valid' });
    }
  } else {
    // For inquiries, try to authenticate but don't fail if no token
    const token = req.cookies && req.cookies.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = {
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role
        };
      } catch (err) {
        // Silent fail for inquiries - just continue without user
        req.user = null;
      }
    }
  }
  
  next();
};

module.exports = conditionalAuth;
