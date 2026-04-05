const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/active', verifyToken, sessionController.getActiveSession);
router.post('/open', verifyToken, sessionController.openSession);
router.post('/close/:id', verifyToken, sessionController.closeSession);

module.exports = router;
