const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
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
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.clearCookie('token');
      return res.status(401).json({
        msg: 'Token has expired. Please log in again.',
        expired: true
      });
    }
    res.status(401).json({ msg: 'Token is not valid' });
  }
};