// routes/goalRoutes.js
const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');
const verifyToken = require('../middlewares/verifyToken');

// Get all goals
router.get('/', verifyToken, goalController.getGoals);

// Add a skill to user's goals
router.post('/add-skill', verifyToken, goalController.addSkillToUser);

// Update goal progress/resources
router.put('/:id', verifyToken, goalController.updateGoal);

// Delete goal
router.delete('/:id', verifyToken, goalController.deleteGoal);

module.exports = router;
