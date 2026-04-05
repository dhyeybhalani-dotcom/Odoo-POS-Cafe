const db = require('../config/db');

const categoryModel = {
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM categories ORDER BY sequence ASC');
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0];
  },

  create: async (categoryData) => {
    const { name, color, sequence } = categoryData;
    const [result] = await db.query(
      'INSERT INTO categories (name, color, sequence) VALUES (?, ?, ?)',
      [name, color || '#ffffff', sequence || 0]
    );
    return result.insertId;
  },

  update: async (id, categoryData) => {
    const { name, color, sequence } = categoryData;
    const [result] = await db.query(
      'UPDATE categories SET name = ?, color = ?, sequence = ? WHERE id = ?',
      [name, color, sequence, id]
    );
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM categories WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = categoryModel;
