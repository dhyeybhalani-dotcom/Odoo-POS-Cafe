const express = require('express');
const customerController = require('../controllers/customerController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);

router.get('/', customerController.getAll);
router.get('/:id', customerController.getOne);
router.post('/', customerController.create);
router.put('/:id', customerController.update);
router.delete('/:id', customerController.delete);

module.exports = router;
