const db = require('../config/db');

const orderItemModel = {
  findByOrderId: async (orderId) => {
    const [rows] = await db.query('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
    return rows;
  }
};

module.exports = orderItemModel;
