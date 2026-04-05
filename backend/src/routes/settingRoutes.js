const express = require('express');
const router = express.Router();
const settingModel = require('../models/settingModel');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyToken, async (req, res) => {
  try {
    const settings = await settingModel.getAll();
    res.json({ success: true, data: { settings } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', [verifyToken, requireAdmin], async (req, res) => {
  try {
    const { key, value } = req.body;
    await settingModel.set(key, value);
    res.json({ success: true, message: 'Setting updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
