const Message = require('../models/Message');
const User = require('../models/User');

/**
 * Send a direct message
 */
exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, message, attachmentUrl } = req.body;

        if (!receiverId || !message) {
            return res.status(400).json({
                success: false,
                message: 'Receiver ID and message are required.'
            });
        }

        const receiver = await User.findOne({ userId: receiverId });

        if (!receiver) {
            return res.status(404).json({
                success: false,
                message: 'Receiver not found.'
            });
        }

        const newMessage = await Message.create({
            senderId: req.user.userId,
            receiverId,
            message,
            attachmentUrl: attachmentUrl || '',
            isRead: false
        });

        return res.status(201).json({
            success: true,
            message: 'Message delivered.',
            data: newMessage
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get conversation between two users
 */
exports.getConversation = async (req, res) => {
    try {
        const { targetUserId } = req.params;

        const messages = await Message.find({
            $or: [
                {
                    senderId: req.user.userId,
                    receiverId: targetUserId
                },
                {
                    senderId: targetUserId,
                    receiverId: req.user.userId
                }
            ]
        }).sort({ createdAt: 1 });

        return res.status(200).json({
            success: true,
            count: messages.length,
            data: messages
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Mark message as read
 */
exports.markAsRead = async (req, res) => {
    try {
        const { messageId } = req.params;

        const updated = await Message.findByIdAndUpdate(
            messageId,
            { isRead: true },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Message not found.'
            });
        }

        return res.status(200).json({
            success: true,
            data: updated
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Delete a message
 */
exports.deleteMessage = async (req, res) => {
    try {
        const { messageId } = req.params;

        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({
                success: false,
                message: 'Message not found.'
            });
        }

        if (message.senderId !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: 'Permission denied.'
            });
        }

        await Message.findByIdAndDelete(messageId);

        return res.status(200).json({
            success: true,
            message: 'Message deleted.'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
