const express = require('express');
const router = express.Router();
const usersController = require('./users');

// Define routes for users
router.post('/login', usersController.login);
router.post('/signup', usersController.signup);
router.get('/', usersController.getAllUsers);
router.get('/:id', usersController.getUserById);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

module.exports = router;