const orderModel = require('../models/orderModel');
const orderItemModel = require('../models/orderItemModel');
const paymentModel = require('../models/paymentModel');
const orderService = require('../services/orderService');
const { successResponse, errorResponse } = require('../utils/response');

const orderController = {
  getAll: async (req, res, next) => {
    try {
      const { status, session_id, customer_id, from, to } = req.query;
      const result = await orderModel.findAll({ status, session_id, customer_id, from, to });
      return successResponse(res, result, 'Orders retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  getOne: async (req, res, next) => {
    try {
      const order = await orderModel.findById(req.params.id);
      if (!order) return errorResponse(res, 'Order not found', 404);

      const items = await orderItemModel.findByOrderId(order.id);
      const payments = await paymentModel.findByOrderId(order.id);

      return successResponse(res, { order: { ...order, items, payments } }, 'Order details retrieved');
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const newOrder = await orderService.createOrder(req.body);
      return successResponse(res, { order: newOrder }, 'Order created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  updateStatus: async (req, res, next) => {
    try {
      const id = req.params.id;
      const { status } = req.body;
      
      const validStatuses = ['draft', 'paid', 'cancelled', 'refunded'];
      if (!validStatuses.includes(status)) {
        return errorResponse(res, 'Invalid status', 422);
      }

      const order = await orderModel.findById(id);
      if (!order) return errorResponse(res, 'Order not found', 404);

      // Example rule: Can only cancel/pay if it's draft
      if (order.status !== 'draft' && (status === 'paid' || status === 'cancelled')) {
        return errorResponse(res, `Cannot change status to ${status} from ${order.status}`, 400);
      }

      await orderModel.updateStatus(id, status);
      const updated = await orderModel.findById(id);

      return successResponse(res, { order: updated }, `Order marked as ${status}`);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const success = await orderModel.deleteDraft(req.params.id);
      if (!success) {
        return errorResponse(res, 'Order not found or is not in draft state', 400);
      }
      return successResponse(res, null, 'Draft order deleted successfully');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = orderController;
