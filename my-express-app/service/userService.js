const User = require('../models/userModel');

const UserService = {
    getAllUsers: async () => {
        try {
            const users = await User.getAllUsers(); // Directly await if it's already a promise
            return users;
        } catch (error) {
            console.error('Error fetching all users:', error);
            throw new Error('Error fetching all users');
        }
    },

    getUserById: async (id) => {
        try {
            const user = await User.getUserById(id); // Directly await if it's already a promise
            return user;
        } catch (error) {
            console.error(`Error fetching user by ID ${id}:`, error);
            throw new Error(`Error fetching user by ID ${id}`);
        }
    },

    updateUser: async (id, userData) => {
        try {
            const result = await User.update(id, userData); // Directly await if it's already a promise
            return result;
        } catch (error) {
            console.error(`Error updating user with ID ${id}:`, error);
            throw new Error(`Error updating user with ID ${id}`);
        }
    },

    deleteUser: async (id) => {
        try {
            const result = await User.delete(id); // Directly await if it's already a promise
            return result;
        } catch (error) {
            console.error(`Error deleting user with ID ${id}:`, error);
            throw new Error(`Error deleting user with ID ${id}`);
        }
    }
};

module.exports = UserService;
