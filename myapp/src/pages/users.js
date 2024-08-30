import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import EditUserModal from '../components/EditUserModal';
import { useNavigate } from 'react-router-dom';
import HTTP from '../service/http';
import { EnpPoint } from '../service/endpoint';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [showAllMessagesModal, setShowAllMessagesModal] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersResponse = await HTTP.Request('GET', `${EnpPoint}/users`);
                const loggedInUserResponse = await HTTP.Request('GET', `${EnpPoint}/users/me`);
                const loggedInUserData = loggedInUserResponse.data[0];
                const otherUsers = usersResponse.data.filter(user => user.id !== loggedInUserData.id);
                setLoggedInUser(loggedInUserData);
                setUsers([loggedInUserData, ...otherUsers]);
            } catch (err) {
                console.error('Error fetching users', err);
            }
        };
        fetchUsers();
    }, []);

    const handleEdit = (userId) => {
        const user = users.find(u => u.id === userId);
        setSelectedUser(user);
        setShowEditModal(true);
    };

    const handleSave = async () => {
        try {
            const response = await HTTP.Request('GET', `${EnpPoint}/users`);

            const loggedInUserResponse = await HTTP.Request('GET', `${EnpPoint}/users/me`);

            const loggedInUserData = loggedInUserResponse.data[0];
            const otherUsers = response.data.filter(user => user.id !== loggedInUserData.id);
            setLoggedInUser(loggedInUserData);
            setUsers([loggedInUserData, ...otherUsers]);
        } catch (err) {
            console.error('Error fetching users', err);
        }
    };

    const handleDelete = (userId) => {
        setUserToDelete(userId);
        setShowDeleteModal(true);
    };
    const navigate = useNavigate()

    const handleConfirmDelete = async () => {
        try {

            localStorage.removeItem('token'); // Remove token from local storage
            navigate('/login'); // Navigate to login page
        } catch (err) {
            console.error('Error deleting user', err);
        }
    };

    const handleViewMessages = async (userId) => {
        if (userId === loggedInUser.id) return;
        try {
            const response = await HTTP.Request('GET', `${EnpPoint}/messages/conversation/${userId}`);
            setMessages(response.data);
            setSelectedUser(users.find(user => user.id === userId));
            setShowMessageModal(true);

        } catch (err) {
            console.error('Error fetching messages', err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        try {
            await HTTP.Request('POST', `${EnpPoint}/messages/send`, {
                receiverId: selectedUser.id,
                content: newMessage,
            });
            setNewMessage('');
            handleViewMessages(selectedUser.id); // Refresh the messages after sending
        } catch (err) {
            console.error('Error sending message', err);
        }
    };

    const handleViewAllMessages = async () => {
        try {
            const response = await HTTP.Request('GET', `${EnpPoint}/messages/me`);
            setMessages(response.data);
            setShowAllMessagesModal(true);
        } catch (err) {
            if (err.response?.status === 404) {
                alert('No messages found for this user.');
            } else {
                console.error('Error fetching all messages', err);
            }
        }
    };
    return (
        <>
            <Button variant="primary" onClick={handleViewAllMessages}>
                See All Msgs
            </Button>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone Number</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone_number}</td>
                            <td>{user.role}</td>
                            <td>
                                {user.id !== loggedInUser.id && (
                                    <Button variant="info" onClick={() => handleViewMessages(user.id)}>Messages</Button>
                                )}
                                {user.id === loggedInUser.id && (
                                    <>
                                        <Button variant="warning" onClick={() => handleEdit(user.id)}>Edit</Button>
                                        <Button variant="danger" onClick={() => handleDelete(user.id)}>Delete</Button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Edit Modal */}
            {selectedUser && (
                <EditUserModal
                    show={showEditModal}
                    handleClose={() => setShowEditModal(false)}
                    user={selectedUser}
                    onSave={handleSave}
                />
            )}

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this user?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Messages Modal */}
            <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Messages with {selectedUser?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                    <div>
                        {messages.map(message => (
                            <div key={message.id} className={`message ${message.sender_id === loggedInUser.id ? 'sent' : 'received'}`}>
                                <p><strong>Sender:</strong> {users.find(user => user.id === message.sender_id)?.name}</p>
                                <p>{message.content}</p>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowMessageModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* All Messages Modal */}
            <Modal show={showAllMessagesModal} onHide={() => setShowAllMessagesModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>All Messages</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {messages.length > 0 ? (
                        <div>
                            {messages.map(message => (
                                <div key={message.id} className="message">
                                    <p><strong>Sender:</strong> {users.find(user => user.id === message.sender_id)?.name}</p>
                                    <p>{message.content}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No messages found.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAllMessagesModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Users;
