import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user data exists in localStorage
    const userData = localStorage.getItem('userData');
    setIsLoggedIn(!!userData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('csrfToken');
    setIsLoggedIn(false);
    window.location.href = '/login'; // Redirect to login after logout
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
      <div className="container">
        <a className="navbar-brand" href="/">Chat Application</a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {!isLoggedIn && (
              <li className="nav-item">
                <a className="nav-link" href="/register">Create Account</a>
              </li>
            )}
            <li className="nav-item">
              <a className="nav-link" href="/mychat">My Chats</a>
            </li>
          </ul>
          <ul className="navbar-nav ms-auto">
            {!isLoggedIn ? (
              <li className="nav-item">
                <a className="nav-link" href="/login">Login</a>
              </li>
            ) : (
              <li className="nav-item">
                <a className="nav-link" onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
