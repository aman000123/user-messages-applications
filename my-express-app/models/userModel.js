const db = require('../config/db');

const queryAsync = async (query, params) => {
    try {
        console.log('Executing query:', query, 'with params:', params);
        const [results] = await db.query(query, params);

        return results;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}


const User = {
    create: async (userData) => {
        try {
            const query = 'INSERT INTO users SET ?';
            const result = await queryAsync(query, userData);
            return result;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error; // Rethrow the error to be handled by the service or controller
        }
    },
    findByEmail: async (email) => {
        try {
            const query = 'SELECT * FROM users WHERE email = ?';
            const results = await queryAsync(query, [email]);
            console.log("result in find email-->", results)
            return results;
        } catch (error) {
            console.error('Error finding user by email:', error); // Ensure errors are logged
            throw error;
        }
    },
    findById: async (id) => {
        try {
            const query = 'SELECT * FROM users WHERE id = ?';
            const results = await queryAsync(query, [id]);
            console.log('Find by ID results:', results);
            return results;
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw error; // Rethrow the error to be handled by the service or controller
        }
    },
    update: async (id, userData) => {
        try {
            const query = 'UPDATE users SET ? WHERE id = ?';
            const result = await queryAsync(query, [userData, id]);
            console.log('User updated:', result);
            return result;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error; // Rethrow the error to be handled by the service or controller
        }
    },
    getAllUsers: async () => {
        try {
            const query = 'SELECT * FROM users';
            const results = await queryAsync(query);
            console.log('All users:', results);
            return results;
        } catch (error) {
            console.error('Error getting all users:', error);
            throw error; // Rethrow the error to be handled by the controller
        }
    },

    getUserById: async (id) => {
        try {
            const query = 'SELECT * FROM users WHERE id = ?';
            const results = await queryAsync(query, [id]);
            console.log('User by ID:', results);
            return results;
        } catch (error) {
            console.error(`Error getting user by ID ${id}:`, error);
            throw error; // Rethrow the error to be handled by the controller
        }
    },

    updateUser: async (id, userData) => {
        try {
            const query = 'UPDATE users SET ? WHERE id = ?';
            const result = await queryAsync(query, [userData, id]);
            console.log('User updated:', result);
            return result;
        } catch (error) {
            console.error(`Error updating user with ID ${id}:`, error);
            throw error; // Rethrow the error to be handled by the controller
        }
    },

    deleteRelatedMessages: async (userId) => {
        try {
            const query = 'DELETE FROM messages WHERE sender_id = ?';
            await queryAsync(query, [userId]);
            console.log('Related messages deleted');
        } catch (error) {
            console.error(`Error deleting messages for user with ID ${userId}:`, error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            // Use this.deleteRelatedMessages or User.deleteRelatedMessages
            await User.deleteRelatedMessages(id); // Corrected access

            // Then delete the user
            const query = 'DELETE FROM users WHERE id = ?';
            const result = await queryAsync(query, [id]);
            console.log('User deleted:', result);
            return result;
        } catch (error) {
            console.error(`Error deleting user with ID ${id}:`, error);
            throw error; // Rethrow the error to be handled by the controller
        }
    },

};

module.exports = User;
