import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #121212; /* Black background for the login page */
  color: #ffffff;
`;

const FormContainer = styled.div`
  background: #1f1f1f; /* Dark card background */
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
  max-width: 400px;
  width: 100%;
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  font-weight: 600;
  color: #ffffff;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  margin-bottom: 1rem;
  border-radius: 0.5rem;
  border: none;
  background: #333333; /* Input background */
  color: #ffffff;
  font-size: 1rem;

  &:focus {
    outline: none;
    border: 1px solid #4a90e2;
    box-shadow: 0 0 5px rgba(74, 144, 226, 0.5);
  }

  &::placeholder {
    color: #bbbbbb; /* Placeholder color */
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #4a90e2; /* Button background */
  color: #ffffff;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #3a78d1;
    box-shadow: 0 4px 10px rgba(74, 144, 226, 0.6);
  }
`;

const ForgotPassword = styled.div`
  margin-top: 1rem;
  font-size: 0.9rem;

  a {
    color: #4a90e2;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.p`
  color: #ff4d4f;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:8000/api/login/', formData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
  
      // Store user data and redirect to chat page
      localStorage.setItem('userData', JSON.stringify(response.data));
      navigate('/profile');
    } catch (err: unknown) {
      // Check if it's an Axios error and handle it
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.detail || 'An error occurred. Please try again.');
      } else {
        // Handle generic errors
        setError('An unexpected error occurred. Please try again later.');
      }
    }
  };
  

  return (
    <LoginContainer>
      <FormContainer>
        <Title>Login</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button type="submit">Login</Button>
        </form>
        <ForgotPassword>
          <a href="/forgot-password">Forgot Password?</a>
        </ForgotPassword>
      </FormContainer>
    </LoginContainer>
  );
};

export default LoginPage;
