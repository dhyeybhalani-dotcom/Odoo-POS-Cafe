const { errorResponse } = require('../utils/response');

const globalErrorHandler = (err, req, res, next) => {
  console.error('Error Details:', err);

  // MySQL Duplicate Entry Error
  if (err.code === 'ER_DUP_ENTRY') {
    return errorResponse(res, 'Duplicate entry found. This record already exists.', 409);
  }

  // MySQL Foreign Key Constraint Error
  if (err.code === 'ER_ROW_IS_REFERENCED_2' || err.code === 'ER_NO_REFERENCED_ROW_2') {
    return errorResponse(res, 'Database relation conflict. Referenced record not found or is in use.', 409);
  }

  // General Validation Error
  if (err.name === 'ValidationError') {
    return errorResponse(res, err.message, 422);
  }

  // Default Internal Server Error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

const notFoundHandler = (req, res, next) => {
  errorResponse(res, `Route not found - ${req.originalUrl}`, 404);
};

module.exports = {
  globalErrorHandler,
  notFoundHandler
};
