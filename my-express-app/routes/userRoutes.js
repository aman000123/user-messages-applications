const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, UserController.getAllUsers);
router.put('/', authMiddleware, UserController.updateUser);
router.delete('/', authMiddleware, UserController.deleteUser);
router.get('/me', authMiddleware, UserController.getLoggedInUser);

module.exports = router;
