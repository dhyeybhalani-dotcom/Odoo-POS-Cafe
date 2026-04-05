const db = require('../config/db');

const floorPlanModel = {
  findAll: async () => {
    const [rows] = await db.query('SELECT * FROM floor_plans ORDER BY id');
    return rows;
  },

  findById: async (id) => {
    const [rows] = await db.query('SELECT * FROM floor_plans WHERE id = ?', [id]);
    return rows[0];
  },

  create: async (data) => {
    const { name, pos_terminal } = data;
    const [result] = await db.query(
      'INSERT INTO floor_plans (name, pos_terminal) VALUES (?, ?)',
      [name, pos_terminal]
    );
    return result.insertId;
  },

  update: async (id, data) => {
    const { name, pos_terminal } = data;
    const [result] = await db.query(
      'UPDATE floor_plans SET name=?, pos_terminal=? WHERE id=?',
      [name, pos_terminal, id]
    );
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const [result] = await db.query('DELETE FROM floor_plans WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};

module.exports = floorPlanModel;
