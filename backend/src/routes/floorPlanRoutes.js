const express = require('express');
const floorPlanController = require('../controllers/floorPlanController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(verifyToken);

router.get('/', floorPlanController.getAll);
router.post('/', floorPlanController.create);
router.put('/:id', floorPlanController.update);
router.delete('/:id', floorPlanController.delete);

module.exports = router;
