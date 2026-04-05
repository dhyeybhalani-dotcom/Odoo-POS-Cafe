const analyticsService = require('../services/analyticsService');
const { successResponse } = require('../utils/response');

const analyticsController = {
  getDashboard: async (req, res, next) => {
    try {
      const { from, to, terminal } = req.query;
      const data = await analyticsService.getDashboardData(from, to, terminal);
      return successResponse(res, data, 'Dashboard data retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  getSummary: async (req, res, next) => {
    try {
      const data = await analyticsService.getSummary();
      return successResponse(res, data, 'Summary KPIs retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = analyticsController;
