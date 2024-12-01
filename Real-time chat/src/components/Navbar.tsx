import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import styled from 'styled-components';

const NavBarContainer = styled.nav`
  background: #1f1f1f; /* Dark background */
  color: #ffffff;
  padding: 0.5rem 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  display: flex;
  align-items: center; /* Center items vertically */
`;

const NavBarBrand = styled.a`
  font-size: 1.5rem;
  font-weight: bold;
  color: #4a90e2;
  text-decoration: none;
  margin-right: 2rem;

  &:hover {
    color: #3a78d1;
  }
`;

const NavLinks = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1; /* Allow nav links to take available space */
  justify-content: flex-start; /* Align items to the left */

  .nav-item {
    margin-right: 1rem;

    a {
      color: #ffffff;
      text-decoration: none;
      font-size: 1rem;

      &:hover {
        color: #4a90e2;
      }
    }
  }
`;

const LogoutButton = styled.button`
  background: #4a90e2;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 1rem;
  margin-left: 1rem; /* Add margin to separate from other items */

  &:hover {
    background: #3a78d1;
  }
`;

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    setIsLoggedIn(!!userData); // Check if user is logged in
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('csrfToken');
    setIsLoggedIn(false); // Update state immediately
    window.location.href = '/login'; // Redirect to login after logout
  };

  return (
    <NavBarContainer className="navbar">
      <NavBarBrand href="/">Chat Application</NavBarBrand>
      <NavLinks>
        {isLoggedIn && (
          <li className="nav-item">
            <a href="/profile">My Profile</a>
          </li>
        )}
        {!isLoggedIn && (
          <li className="nav-item">
            <a href="/register">Create Account</a>
          </li>
        )}
        {isLoggedIn && (
          <li className="nav-item">
            <a href="/mychat">My Chats</a>
          </li>
        )}
        {!isLoggedIn && (
          <li className="nav-item">
            <a href="/login">Login</a>
          </li>
        )}
        {isLoggedIn && (
          <li className="nav-item">
            <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
          </li>
        )}
      </NavLinks>
    </NavBarContainer>
  );
};

export default NavBar;
