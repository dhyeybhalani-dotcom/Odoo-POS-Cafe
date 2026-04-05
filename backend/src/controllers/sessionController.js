const sessionModel = require('../models/sessionModel');

const sessionController = {
  getActiveSession: async (req, res) => {
    try {
      const userId = req.user.id;
      const session = await sessionModel.findActive(userId);
      res.json({ success: true, data: { session } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  openSession: async (req, res) => {
    try {
      const { opening_balance } = req.body;
      const userId = req.user.id;
      
      const active = await sessionModel.findActive(userId);
      if (active) {
        return res.status(400).json({ success: false, message: 'Session already open' });
      }

      const sessionId = await sessionModel.create({
        user_id: userId,
        opening_balance
      });

      res.json({ success: true, data: { sessionId } });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  closeSession: async (req, res) => {
    try {
      const { id } = req.params;
      const { closing_balance, total_sales } = req.body;
      
      await sessionModel.close(id, { closing_balance, total_sales });
      res.json({ success: true, message: 'Session closed successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = sessionController;
