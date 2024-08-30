const Message = require('../models/messageModel');

const MessageService = {
    sendMessage: async (sender_id, receiver_id, content) => {
        try {
            if (!sender_id || !receiver_id || !content) {
                throw new Error('Sender ID, receiver ID, and content are required');
            }
            // Call the createMessage method
            const result = await Message.createMessage(sender_id, receiver_id, content);
            return result;
        } catch (error) {
            console.error('Error in MessageService.sendMessage:', error.message);
            throw error;
        }
    },


    getConversation: async (loggedInUserId, otherUserId) => {
        try {
            if (isNaN(loggedInUserId) || isNaN(otherUserId) || loggedInUserId <= 0 || otherUserId <= 0) {
                throw new Error('Invalid user IDs');
            }

            // Ensure `findConversationBetweenUsers` returns an empty array if no messages are found
            const messages = await Message.findConversationBetweenUsers(loggedInUserId, otherUserId);
            if (!messages) {
                console.log('No messages found');
                return []; // Handle case where result is null
            }

            if (messages.length === 0) {
                return []; // No conversation found
            }

            const messageIds = messages.map(msg => msg.id);
            // Ensure `findRepliesToMessages` returns an empty array if no replies are found
            const replies = await Message.findRepliesToMessages(messageIds);
            if (!replies) {
                console.log('No replies found');
                return messages.map(msg => ({
                    ...msg,
                    replies: [] // No replies for the messages
                }));
            }

            const conversation = messages.map(msg => ({
                ...msg,
                replies: replies.filter(reply => reply.parent_message_id === msg.id)
            }));

            return conversation;
        } catch (error) {
            console.error('Error in MessageService.getConversation:', error.message);
            throw new Error(`Error getting conversation: ${error.message}`);
        }
    }
    ,


    getMessagesForReceiver: async (receiverId) => {
        try {
            const messages = await Message.getMessagesForReceiver(receiverId);
            return messages;
        } catch (error) {
            console.error('Error in MessageService.getMessagesForReceiver:', error.message);
            throw new Error(`Error getting messages for receiver: ${error.message}`);
        }
    }
};

module.exports = MessageService;
