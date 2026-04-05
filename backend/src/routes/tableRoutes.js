const express = require('express');
const tableController = require('../controllers/tableController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);

router.get('/', tableController.getAll);
router.post('/', tableController.create);
router.put('/:id', tableController.update);
router.patch('/:id/status', tableController.updateStatus);
router.delete('/:id', tableController.delete);

module.exports = router;
