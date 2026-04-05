const { hashPassword, comparePassword, generateToken } = require('../utils/helpers');
const userModel = require('../models/userModel');

const authService = {
  login: async (email, password) => {
    const user = await userModel.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    const token = generateToken(payload);
    
    return { token, user: payload };
  },

  signup: async (userData) => {
    const existingUser = await userModel.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('Email is already registered');
    }

    const hashedPassword = await hashPassword(userData.password);
    const newUser = await userModel.create({
      ...userData,
      password: hashedPassword
    });

    const payload = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    };

    const token = generateToken(payload);

    return { token, user: payload };
  },

  updateProfile: async (id, name, profile_pic) => {
    const success = await userModel.updateProfile(id, name, profile_pic);
    if (!success) {
      throw new Error('User not found or update failed');
    }
    const user = await userModel.findById(id);
    return user;
  }
};

module.exports = authService;
