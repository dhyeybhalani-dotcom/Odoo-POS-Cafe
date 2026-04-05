const floorPlanModel = require('../models/floorPlanModel');
const tableModel = require('../models/tableModel');
const { successResponse, errorResponse } = require('../utils/response');

const floorPlanController = {
  getAll: async (req, res, next) => {
    try {
      const floorPlans = await floorPlanModel.findAll();
      
      // Inject tables into each floor plan
      for (let i = 0; i < floorPlans.length; i++) {
        floorPlans[i].tables = await tableModel.findAll({ floor_plan_id: floorPlans[i].id });
      }

      return successResponse(res, { floorPlans }, 'Floor plans retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const id = await floorPlanModel.create(req.body);
      const floorPlan = await floorPlanModel.findById(id);
      return successResponse(res, { floorPlan }, 'Floor plan created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const success = await floorPlanModel.update(req.params.id, req.body);
      if (!success) return errorResponse(res, 'Floor plan not found', 404);
      
      const floorPlan = await floorPlanModel.findById(req.params.id);
      return successResponse(res, { floorPlan }, 'Floor plan updated successfully');
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const success = await floorPlanModel.delete(req.params.id);
      if (!success) return errorResponse(res, 'Floor plan not found or could not be deleted', 404);
      return successResponse(res, null, 'Floor plan deleted successfully');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = floorPlanController;
