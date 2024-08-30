const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken')
const AuthService = {
    register: async (userData) => {
        try {
            const { email, password } = userData;
            if (!email) throw new Error('Email is required');
            if (!password) throw new Error('Password is required');

            const existingUsers = await User.findByEmail(email);
            if (existingUsers.length > 0) throw new Error('Email already in use');

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const newUser = { ...userData, password: hashedPassword };

            // Create the user and get the result
            const result = await User.create(newUser);
            const createdUser = await User.findById(result.insertId);
            return createdUser;
        } catch (error) {
            console.error('Error in AuthService.register:', error.message);
            throw new Error(`Error registering user: ${error.message}`);
        }
    },



    login: async (email, password) => {
        try {
            if (!email) throw new Error('Email is required');
            if (!password) throw new Error('Password is required');

            // Find user by email
            const users = await User.findByEmail(email);
            console.log("users", users); // Log the retrieved users

            if (users.length === 0) throw new Error('User not found');

            const user = users[0];

            // Compare passwords
            const isMatch = await bcrypt.compare(password, user.password);
            console.log("Password match:", isMatch);

            if (!isMatch) throw new Error('Invalid credentials');

            // Generate JWT token
            const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });

            console.log("Generated JWT token:", token);

            return { token, user };
        } catch (error) {
            console.error(`Error logging in: ${error.message}`);
            throw new Error(`Error logging in: ${error.message}`);
        }
    }

};

module.exports = AuthService;
