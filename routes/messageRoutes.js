const express = require('express');
const router = express.Router();

const {
    sendMessage,
    getConversation,
    getUserMessages,
    markAsRead,
    deleteMessage
} = require('../controllers/messageController');

// Send message
router.post('/send', sendMessage);

// Get all messages for logged-in user
router.get('/user/:userId', getUserMessages);

// Get conversation between users
router.get('/conversation/:conversationId', getConversation);

// Mark message as read
router.put('/read/:messageId', markAsRead);

// Delete message
router.delete('/:messageId', deleteMessage);

module.exports = router;
