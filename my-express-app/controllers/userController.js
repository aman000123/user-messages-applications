const UserService = require('../service/userService');

const UserController = {
    getAllUsers: async (req, res) => {
        try {
            const users = await UserService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching users', error });
        }
    },

    updateUser: async (req, res) => {
        try {
            const userId = req.user.id; // Extract the user ID from the token
            const result = await UserService.updateUser(userId, req.body);
            res.status(200).json({ message: 'User updated successfully', result });
        } catch (error) {
            res.status(500).json({ message: 'Error updating user', error });
        }
    },

    deleteUser: async (req, res) => {
        try {
            const userId = req.user.id; // Extract the user ID from the token
            const result = await UserService.deleteUser(userId);
            res.status(200).json({ message: 'User deleted successfully', result });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting user', error });
        }
    },
    getLoggedInUser: async (req, res) => {
        try {
            const userId = req.user.id;  // Extracting user ID from token
            const user = await UserService.getUserById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching user details', error });
        }
    },

};

module.exports = UserController;
