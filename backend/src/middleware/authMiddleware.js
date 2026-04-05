const jwt = require('jsonwebtoken');
const { errorResponse } = require('../utils/response');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 'Access Denied. No token provided.', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains id, name, email, role
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return errorResponse(res, 'Token Expired.', 401);
    }
    return errorResponse(res, 'Invalid Token.', 403);
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return errorResponse(res, 'Access Denied. Admin privileges required.', 403);
  }
};

module.exports = {
  verifyToken,
  requireAdmin
};
