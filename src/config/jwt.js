const jwt = require('jsonwebtoken');

/**
 * Tạo JWT token
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

/**
 * Verify JWT token
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

/**
 * Extract token từ request header
 */
const extractToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }
  
  // Kiểm tra token trong cookies
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  
  return null;
};

module.exports = {
  generateToken,
  verifyToken,
  extractToken
};
