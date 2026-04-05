const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);
// router.use(requireAdmin); // Temporarily commented out so newly registered demo users (cashiers) can see the dashboard

router.get('/dashboard', analyticsController.getDashboard);
router.get('/summary', analyticsController.getSummary);

module.exports = router;
