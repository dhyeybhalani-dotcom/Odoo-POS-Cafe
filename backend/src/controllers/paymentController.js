const paymentModel = require('../models/paymentModel');
const { successResponse } = require('../utils/response');

const paymentController = {
  getAll: async (req, res, next) => {
    try {
      const { method, from, to } = req.query;
      const payments = await paymentModel.findFiltered({ method, from, to });

      // Group structure as requested
      const grouped = {};
      payments.forEach(p => {
        if (!grouped[p.method]) grouped[p.method] = { method: p.method, total: 0, transactions: [] };
        grouped[p.method].total += Number(p.amount);
        grouped[p.method].transactions.push(p);
      });

      return successResponse(res, {
        payments,
        grouped: Object.values(grouped)
      }, 'Payments retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const id = await paymentModel.create(req.body);
      return successResponse(res, { payment: { id, ...req.body } }, 'Payment recorded successfully', 201);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = paymentController;
