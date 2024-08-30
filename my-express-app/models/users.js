const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Ensure this is your Sequelize instance

const User = sequelize.define('User', {
    // Define columns
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: true
    },
    role: {
        type: DataTypes.ENUM('Teacher', 'Student', 'Institute'),
        allowNull: false
    }
}, {
    tableName: 'users', // Name of the table in the database
    timestamps: true // Add createdAt and updatedAt fields
});

module.exports = User;
