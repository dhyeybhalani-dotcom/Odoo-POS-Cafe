const express = require('express');
const paymentController = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);

router.get('/', paymentController.getAll);
router.post('/', paymentController.create);

module.exports = router;
