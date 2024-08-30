const db = require('../config/db');

const queryAsync = async (query, params) => {
    try {
        console.log('Executing query:', query, 'with params:', params);
        const [results] = await db.query(query, params);
        return results;
    } catch (error) {
        console.error('Database query error:', error.message);
        throw new Error(`Database query error: ${error.message}`);
    }
};

const Message = {
    createMessage: async (senderId, receiverId, content, replyMsg = '') => {
        try {
            if (!senderId || !receiverId || !content) {
                throw new Error('Sender ID, receiver ID, and content are required');
            }
            const query = 'INSERT INTO messages (sender_id, receiver_id, content, replyMsg) VALUES (?, ?, ?, ?)';
            const result = await queryAsync(query, [senderId, receiverId, content, replyMsg]);
            return result;
        } catch (error) {
            console.error('Error creating message:', error.message);
            throw new Error(`Error creating message: ${error.message}`);
        }
    },
    createReply: async (parentMessageId, senderId, content) => {
        try {
            if (!parentMessageId || !senderId || !content) {
                throw new Error('Parent message ID, sender ID, and content are required');
            }
            const query = 'INSERT INTO messages (sender_id, content, parent_message_id) VALUES (?, ?, ?)';
            const result = await queryAsync(query, [senderId, content, parentMessageId]);
            return result;
        } catch (error) {
            console.error('Error creating reply:', error.message);
            throw new Error(`Error creating reply: ${error.message}`);
        }
    },

    findConversationBetweenUsers: async (userId1, userId2) => {
        try {
            if (isNaN(userId1) || isNaN(userId2) || userId1 <= 0 || userId2 <= 0) {
                throw new Error('Invalid user IDs');
            }
            const query = `
                SELECT m.id, m.sender_id, m.receiver_id, m.content, m.created_at, 
                       u1.name AS sender_name, u2.name AS receiver_name
                FROM messages m
                JOIN users u1 ON m.sender_id = u1.id
                JOIN users u2 ON m.receiver_id = u2.id
                WHERE (m.sender_id = ? AND m.receiver_id = ?)
                   OR (m.sender_id = ? AND m.receiver_id = ?)
                ORDER BY m.created_at ASC
            `;
            const result = await queryAsync(query, [userId1, userId2, userId2, userId1]);

            // If no messages found, return null instead of an empty array
            if (result.length === 0) {
                return null;
            }


            return result;
        } catch (error) {
            console.error('Error finding conversation:', error.message);
            throw new Error(`Error finding conversation: ${error.message}`);
        }
    },

    findRepliesToMessages: async (messageIds) => {
        try {
            if (!Array.isArray(messageIds) || messageIds.length === 0) {
                throw new Error('Invalid message IDs array');
            }
            const query = `
                SELECT id, sender_id, content, parent_message_id
                FROM messages
                WHERE parent_message_id IN (?)
            `;
            const result = await queryAsync(query, [messageIds]);
            return result;
        } catch (error) {
            console.error('Error finding replies to messages:', error.message);
            throw new Error(`Error finding replies to messages: ${error.message}`);
        }
    },


    getMessageById: async (messageId) => {
        try {
            if (isNaN(messageId) || messageId <= 0) {
                throw new Error('Invalid message ID');
            }
            const query = 'SELECT * FROM messages WHERE id = ?';
            const result = await queryAsync(query, [messageId]);
            return result[0] || null; // Return null if no message is found
        } catch (error) {
            console.error('Error finding message by ID:', error.message);
            throw new Error(`Error finding message by ID: ${error.message}`);
        }
    },

    getMessagesForReceiver: async (receiverId) => {
        try {
            const query = `
                SELECT m.id, m.sender_id, m.receiver_id, m.content, m.created_at, 
                       u1.name AS sender_name, u2.name AS receiver_name
                FROM messages m
                JOIN users u1 ON m.sender_id = u1.id
                JOIN users u2 ON m.receiver_id = u2.id
                WHERE m.receiver_id = ?
                ORDER BY m.created_at ASC
            `;
            const result = await queryAsync(query, [receiverId]);

            // If no messages found, return null instead of an empty array
            // If no messages found, return null instead of an empty array
            if (result.length === 0) {
                return null;
            }

            return result;
        } catch (error) {
            console.error('Error getting messages for receiver:', error.message);
            throw new Error(`Error getting messages for receiver: ${error.message}`);
        }
    }
};

module.exports = Message;
