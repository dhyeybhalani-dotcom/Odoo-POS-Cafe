const tableModel = require('../models/tableModel');
const { successResponse, errorResponse } = require('../utils/response');

const tableController = {
  getAll: async (req, res, next) => {
    try {
      const filters = {
        floor_plan_id: req.query.floor_plan_id,
        status: req.query.status
      };
      const tables = await tableModel.findAll(filters);
      return successResponse(res, { tables }, 'Tables retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const id = await tableModel.create(req.body);
      const table = await tableModel.findById(id);
      return successResponse(res, { table }, 'Table created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const success = await tableModel.update(req.params.id, req.body);
      if (!success) return errorResponse(res, 'Table not found', 404);
      
      const table = await tableModel.findById(req.params.id);
      return successResponse(res, { table }, 'Table updated successfully');
    } catch (error) {
      next(error);
    }
  },

  updateStatus: async (req, res, next) => {
    try {
      const { status } = req.body;
      const validStatuses = ['available', 'occupied', 'reserved'];
      if (!validStatuses.includes(status)) {
        return errorResponse(res, 'Invalid status', 422);
      }

      const success = await tableModel.updateStatus(req.params.id, status);
      if (!success) return errorResponse(res, 'Table not found', 404);

      const table = await tableModel.findById(req.params.id);
      return successResponse(res, { table }, `Table status updated to ${status}`);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const success = await tableModel.delete(req.params.id);
      if (!success) return errorResponse(res, 'Table not found or could not be deleted', 404);
      return successResponse(res, null, 'Table deleted successfully');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = tableController;
