const db = require('../config/db');

const settingModel = {
  get: async (key) => {
    const [rows] = await db.query('SELECT value FROM settings WHERE setting_key = ?', [key]);
    return rows[0] ? rows[0].value : null;
  },

  getAll: async () => {
    const [rows] = await db.query('SELECT * FROM settings');
    return rows.reduce((acc, row) => {
      acc[row.setting_key] = row.value;
      return acc;
    }, {});
  },

  set: async (key, value) => {
    const [rows] = await db.query('SELECT id FROM settings WHERE setting_key = ?', [key]);
    if (rows.length > 0) {
      await db.query('UPDATE settings SET value = ? WHERE setting_key = ?', [value, key]);
    } else {
      await db.query('INSERT INTO settings (setting_key, value) VALUES (?, ?)', [key, value]);
    }
    return true;
  }
};

module.exports = settingModel;
