const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const MessageController = require('../controllers/messgaeController');


router.post('/send', authMiddleware, MessageController.sendMessage);

router.get('/conversation/:UserId', authMiddleware, MessageController.getConversation);
router.get('/me', authMiddleware, MessageController.getMessagesForLoggedInUser);

module.exports = router;
