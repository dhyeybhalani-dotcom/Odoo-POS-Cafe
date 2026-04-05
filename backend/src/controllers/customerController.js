const customerModel = require('../models/customerModel');
const { successResponse, errorResponse } = require('../utils/response');

const customerController = {
  getAll: async (req, res, next) => {
    try {
      const search = req.query.search || '';
      const customers = await customerModel.findAll(search);
      return successResponse(res, { customers }, 'Customers retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  getOne: async (req, res, next) => {
    try {
      const customer = await customerModel.findById(req.params.id);
      if (!customer) return errorResponse(res, 'Customer not found', 404);
      return successResponse(res, { customer }, 'Customer retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const id = await customerModel.create(req.body);
      const newCustomer = await customerModel.findById(id);
      return successResponse(res, { customer: newCustomer }, 'Customer created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const id = req.params.id;
      const success = await customerModel.update(id, req.body);
      if (!success) return errorResponse(res, 'Customer not found', 404);
      
      const updatedCustomer = await customerModel.findById(id);
      return successResponse(res, { customer: updatedCustomer }, 'Customer updated successfully');
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const success = await customerModel.delete(req.params.id);
      if (!success) return errorResponse(res, 'Customer not found or could not be deleted', 404);
      return successResponse(res, null, 'Customer deleted successfully');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = customerController;
