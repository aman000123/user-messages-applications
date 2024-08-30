import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
    const token = localStorage.getItem('token');

    return (
        <div>
            <Navbar bg="dark" variant="dark" expand="lg">
                <Navbar.Brand as={Link} to="/">MyApp</Navbar.Brand>
                <Nav className="mr-auto">
                    {!token && (
                        <>
                            <Nav.Link as={Link} to="/register">Register</Nav.Link>
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        </>
                    )}
                    {token && (
                        <Nav.Link as={Link} to="/users">Users</Nav.Link>
                    )}
                </Nav>
            </Navbar>
            <Container className="mt-4">
                {children}
            </Container>
        </div>
    );
};

export default Layout;
