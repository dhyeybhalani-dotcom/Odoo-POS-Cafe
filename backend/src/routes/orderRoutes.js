const express = require('express');
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);

router.get('/', orderController.getAll);
router.get('/:id', orderController.getOne);

router.post('/', orderController.create);
router.patch('/:id/status', orderController.updateStatus);
router.delete('/:id', orderController.delete);

module.exports = router;
