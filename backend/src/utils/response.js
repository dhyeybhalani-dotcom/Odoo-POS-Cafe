const successResponse = (res, data, message = 'Success', status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data
  });
};

const errorResponse = (res, message = 'Error', status = 400) => {
  return res.status(status).json({
    success: false,
    message
  });
};

const paginatedResponse = (res, data, total, page, limit, message = 'Success', status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
    pagination: {
      total: Number(total),
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / limit)
    }
  });
};

module.exports = {
  successResponse,
  errorResponse,
  paginatedResponse
};
