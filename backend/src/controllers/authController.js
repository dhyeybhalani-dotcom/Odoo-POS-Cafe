const authService = require('../services/authService');
const { successResponse } = require('../utils/response');

const authController = {
  signup: async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const { token, user } = await authService.signup({ name, email, password });
      return successResponse(res, { token, user }, 'User created successfully', 201);
    } catch (error) {
      if (error.message === 'Email is already registered') {
        error.statusCode = 409;
      }
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { token, user } = await authService.login(email, password);
      return successResponse(res, { token, user }, 'Logged in successfully');
    } catch (error) {
      if (error.message === 'Invalid email or password') {
        error.statusCode = 401;
      }
      next(error);
    }
  },

  getMe: async (req, res, next) => {
    try {
      return successResponse(res, { user: req.user }, 'User details retrieved');
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res, next) => {
    try {
      // In JWT stateless architecture, logout is usually handled client-side by deleting token.
      // Can add token blocklisting if required.
      return successResponse(res, null, 'Logged out successfully');
    } catch (error) {
      next(error);
    }
  },

  updateProfile: async (req, res, next) => {
    try {
      const { name, profile_pic } = req.body;
      const user = await authService.updateProfile(req.user.id, name, profile_pic);
      return successResponse(res, { user }, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
