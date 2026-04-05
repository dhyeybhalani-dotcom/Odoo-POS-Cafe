const productModel = require('../models/productModel');
const { successResponse, errorResponse } = require('../utils/response');

const productController = {
  getAll: async (req, res, next) => {
    try {
      const { category, archived = 'false', search, limit, offset } = req.query;
      const result = await productModel.findAll({ category, archived, search, limit, offset });
      return successResponse(res, result, 'Products retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  getOne: async (req, res, next) => {
    try {
      const product = await productModel.findById(req.params.id);
      if (!product) return errorResponse(res, 'Product not found', 404);
      return successResponse(res, { product }, 'Product retrieved successfully');
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const productData = req.body;
      const variants = req.body.variants || [];
      
      const productId = await productModel.create(productData, variants);
      const newProduct = await productModel.findById(productId);
      
      return successResponse(res, { product: newProduct }, 'Product created successfully', 201);
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const id = req.params.id;
      const productData = req.body;
      const variants = req.body.variants || [];

      const exists = await productModel.findById(id);
      if (!exists) return errorResponse(res, 'Product not found', 404);

      await productModel.update(id, productData, variants);
      const updatedProduct = await productModel.findById(id);
      
      return successResponse(res, { product: updatedProduct }, 'Product updated successfully');
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const id = req.params.id;
      const success = await productModel.delete(id);
      if (!success) return errorResponse(res, 'Product not found or could not be deleted', 404);
      
      return successResponse(res, null, 'Product deleted successfully');
    } catch (error) {
      next(error);
    }
  },

  archive: async (req, res, next) => {
    try {
      const id = req.params.id;
      const success = await productModel.archive(id);
      if (!success) return errorResponse(res, 'Product not found or already archived', 404);

      return successResponse(res, null, 'Product archived successfully');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = productController;
