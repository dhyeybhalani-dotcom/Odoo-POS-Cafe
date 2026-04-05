const categoryModel = require('../models/categoryModel');
const { successResponse, errorResponse } = require('../utils/response');

const categoryController = {
  getAll: async (req, res, next) => {
    try {
      const categories = await categoryModel.findAll();
      return successResponse(res, { categories }, 'Categories retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const id = await categoryModel.create(req.body);
      const category = await categoryModel.findById(id);
      return successResponse(res, { category }, 'Category created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const success = await categoryModel.update(req.params.id, req.body);
      if (!success) return errorResponse(res, 'Category not found', 404);
      
      const category = await categoryModel.findById(req.params.id);
      return successResponse(res, { category }, 'Category updated successfully');
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const success = await categoryModel.delete(req.params.id);
      if (!success) return errorResponse(res, 'Category not found or could not be deleted', 404);
      return successResponse(res, null, 'Category deleted successfully');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = categoryController;
