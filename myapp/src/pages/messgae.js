import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, ListGroup } from 'react-bootstrap';
import HTTP from '../service/http';
import { EnpPoint } from '../service/endpoint';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replies, setReplies] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await HTTP.Request('GET', `${EnpPoint}/api/messages`);
                setMessages(response.data);
            } catch (err) {
                console.error('Error fetching messages', err);
            }
        };
        fetchMessages();
    }, []);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        try {
            await HTTP.Request('POST', `${EnpPoint}/api/messages/send`, { receiverId: 'receiver-id-here', content: newMessage });
            setNewMessage('');
            // Refresh messages
            const response = await HTTP.Request('GET', `${EnpPoint}/api/messages`);
            setMessages(response.data);
        } catch (err) {
            console.error('Error sending message', err);
        }
    };

    const handleViewReplies = async (messageId) => {
        try {
            const response = await HTTP.Request('GET', `${EnpPoint}/api/messages/replies/${messageId}`);
            setReplies(response.data);
            setSelectedMessage(messageId);
        } catch (err) {
            console.error('Error fetching replies', err);
        }
    };

    return (
        <div>
            <Form onSubmit={handleSendMessage}>
                <Form.Group controlId="formMessage">
                    <Form.Label>Send Message</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">Send</Button>
            </Form>

            <h3>Messages</h3>
            <ListGroup>
                {messages.map(msg => (
                    <ListGroup.Item key={msg.id}>
                        <strong>From:</strong> {msg.senderName} <br />
                        <strong>Content:</strong> {msg.content} <br />
                        <Button variant="link" onClick={() => handleViewReplies(msg.id)}>View Replies</Button>
                    </ListGroup.Item>
                ))}
            </ListGroup>

            {selectedMessage && (
                <>
                    <h3>Replies</h3>
                    <ListGroup>
                        {replies.map(reply => (
                            <ListGroup.Item key={reply.id}>
                                <strong>From:</strong> {reply.senderName} <br />
                                <strong>Content:</strong> {reply.content}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </>
            )}
        </div>
    );
};

export default Messages;
