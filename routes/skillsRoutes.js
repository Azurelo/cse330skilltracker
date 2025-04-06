const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/api', skillController.getSkills);
router.post('/api', verifyToken, skillController.addSkill);

module.exports = router;
