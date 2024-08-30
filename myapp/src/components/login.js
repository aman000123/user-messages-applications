// src/pages/Login.js
import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import HTTP from '../service/http';
import { EnpPoint } from '../service/endpoint';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await HTTP.Request('POST', `${EnpPoint}/auth/login`, { email, password });
            // Store the token in local storage
            const { token } = response.data;
            localStorage.setItem('token', token);
            navigate('/users')
        } catch (err) {
            alert('Login failed');
        }
    };
    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </Form.Group>
            <Button variant="primary" type="submit">Login</Button>
            <NavLink to='/register'>Sign Up</NavLink>
        </Form>
    );
};

export default Login;
