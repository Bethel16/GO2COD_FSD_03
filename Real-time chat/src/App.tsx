import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import ChatApp from './components/ChatApp';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import UserProfile from './components/UserProfile';
const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
        <Route path="/profile" element={<UserProfile />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/mychat" element={<ChatApp />} />
          <Route path="/logout" element={<h2>You have been logged out.</h2>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
