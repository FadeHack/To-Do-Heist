const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User routes
router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/details', userController.getUserDetails);

module.exports = router;
