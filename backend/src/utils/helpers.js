const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateOrderNumber = () => {
  return "ORD-" + Date.now();
};

const calculateOrderTotals = (items) => {
  let subtotal = 0;
  let taxTotal = 0;

  items.forEach(item => {
    const qty = Number(item.quantity);
    const price = Number(item.unit_price);
    const taxRate = Number(item.tax) || 5.0; // Default 5%

    const itemSubtotal = qty * price;
    const itemTax = itemSubtotal * (taxRate / 100);

    subtotal += itemSubtotal;
    taxTotal += itemTax;
  });

  return {
    subtotal: subtotal.toFixed(2),
    taxTotal: taxTotal.toFixed(2),
    total: (subtotal + taxTotal).toFixed(2)
  };
};

const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(plainPassword, salt);
};

const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", 
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", 
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", 
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

module.exports = {
  generateOrderNumber,
  calculateOrderTotals,
  hashPassword,
  comparePassword,
  generateToken,
  indianStates
};
