const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register); 
router.post('/login', authController.login);

// Serve register and login pages
router.get('/register', (req, res) => res.sendFile('register.html', { root: 'views' }));
router.get('/login', (req, res) => res.sendFile('login.html', { root: 'views' }));

module.exports = router;
