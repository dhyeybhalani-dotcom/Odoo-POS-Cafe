const express = require('express');
const productController = require('../controllers/productController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// All product routes require authentication
router.use(verifyToken);

router.get('/', productController.getAll);
router.get('/:id', productController.getOne);

router.post('/', productController.create);
router.put('/:id', productController.update);
router.delete('/:id', productController.delete);
router.patch('/:id/archive', productController.archive);

module.exports = router;
