const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const verifyToken = require('../middlewares/verifyToken');

// Protect goal routes with JWT verification
router.post('/', verifyToken, goalController.addGoal);
router.get('/', verifyToken, goalController.getGoals);
router.put('/', verifyToken, goalController.updateGoalProgress);
router.delete('/:id', verifyToken, goalController.deleteGoal);

module.exports = router;
