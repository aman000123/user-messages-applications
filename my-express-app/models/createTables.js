require('dotenv').config();

const db = require('../config/db');
console.log("db ", db)
// SQL query to create the users table
const createUserTable = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone_number VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        role ENUM('Teacher', 'Student', 'Institute') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
`;


const createParentMessagesTable = `
    CREATE TABLE IF NOT EXISTS parent_messages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sender_id INT NOT NULL,
        receiver_id INT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
    )
`;


const createMessagesTable = `
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
    sender_id INT NOT NULL,
    receiver_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    parent_message_id INT,
    replyMsg  TEXT NOT NULL,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id),
    FOREIGN KEY (parent_message_id) REFERENCES parent_messages(id) ON DELETE CASCADE
    )
`;


const createTables = async () => {
    try {
        // Execute the query to create the users table
        await db.query(createUserTable);
        console.log('Users table created successfully!');

        await db.query(createParentMessagesTable);
        console.log('Messages parents table created successfully!');
        // Execute the query to create the messages table
        await db.query(createMessagesTable);
        console.log('Messages table created successfully!');

    } catch (error) {
        console.error('Error creating tables:', error);
    }
};

// Run the script
createTables();
