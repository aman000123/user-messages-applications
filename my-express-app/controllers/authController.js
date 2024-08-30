const AuthService = require('../service/authService');

const AuthController = {
    register: async (req, res) => {
        try {
            const user = await AuthService.register(req.body);
            res.status(200).json({ message: 'User registered successfully', user });
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({ message: 'Error registering user', error: error.message });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const { token, user } = await AuthService.login(email, password);
            res.status(200).json({ message: 'Login successful', token, user });
        } catch (error) {
            res.status(401).json({ message: 'Login failed', error });
        }
    },

    logout: (req, res) => {
        // Perform logout actions if needed (e.g., invalidate token)
        res.status(200).json({ message: 'Logout successful' });
    }
};

module.exports = AuthController;
