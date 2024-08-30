import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Users from './pages/users';
import Layout from './components/layout';
import Login from './components/login';
import Register from './components/register';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/users" element={<Users />} />
          <Route path="/" element={<Register />} /> {/* Default route */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
