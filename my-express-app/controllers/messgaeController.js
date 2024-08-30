const MessageService = require('../service/messageService');

const MessageController = {
    sendMessage: async (req, res) => {
        try {
            const { receiverId, content } = req.body;
            const senderId = req.user.id;

            if (!receiverId || !content) {
                return res.status(400).json({ message: 'Receiver ID and content are required' });
            }

            await MessageService.sendMessage(senderId, receiverId, content);
            res.status(201).json({ message: 'Message sent successfully' });
        } catch (error) {
            console.error('Error in MessageController.sendMessage:', error.message);
            res.status(500).json({ message: 'Error sending message', error: error.message });
        }
    },



    getConversation: async (req, res) => {
        try {
            const loggedInUserId = req.user.id;
            const otherUserId = parseInt(req.params.UserId, 10);

            if (isNaN(otherUserId) || otherUserId <= 0) {
                return res.status(400).json({ message: 'Invalid user ID' });
            }

            const conversation = await MessageService.getConversation(loggedInUserId, otherUserId);

            // if (conversation.length === 0) {
            //     return res.status(404).json({ message: 'No conversation found' });
            // }

            res.status(200).json(conversation);
        } catch (error) {
            console.error('Error in MessageController.getConversation:', error.message);
            res.status(500).json({ message: 'Error fetching conversation', error: error.message });
        }
    }
    ,


    getMessagesForLoggedInUser: async (req, res) => {
        try {
            const receiverId = req.user.id;

            const messages = await MessageService.getMessagesForReceiver(receiverId);

            if (messages === null) { // Handle null case
                return res.status(404).json({ message: 'No messages found for this user' });
            }

            res.status(200).json(messages);
        } catch (error) {
            console.error('Error in MessageController.getMessagesForLoggedInUser:', error.message);
            res.status(500).json({ message: 'Error fetching messages', error: error.message });
        }
    }
};

module.exports = MessageController;
