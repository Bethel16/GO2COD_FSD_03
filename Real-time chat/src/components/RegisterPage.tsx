import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// CSRF token utility function
const getCSRFToken = (): string | null => {
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('csrftoken='));
  return csrfToken ? csrfToken.split('=')[1] : null;
};

const RegisterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #121212; /* Black background */
  color: #ffffff; /* Light text for contrast */
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

const ErrorMessage = styled.p`
  color: #ff4d4f;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password2: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.password2) {
      setError('Passwords do not match!');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('username', formData.username);
    formDataToSend.append('first_name', formData.first_name);
    formDataToSend.append('last_name', formData.last_name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    const csrfToken = getCSRFToken();

    try {
      const response = await axios.post('http://localhost:8000/api/register/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRFToken': csrfToken || '',
        },
      });
      console.log('User registered:', response.data);
      setError(''); // Clear any existing errors
      // Redirect or show success message
      alert('Registration successful! You can now log in.');
    } catch (error) {
      console.error('Registration failed:', error);
      setError('Failed to register. Please try again.');
    }
  };

  return (
    <RegisterContainer>
      <FormContainer>
        <Title>Create Account</Title>
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
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
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
          <Input
            type="password"
            name="password2"
            placeholder="Confirm Password"
            value={formData.password2}
            onChange={handleChange}
            required
          />
          <Button type="submit">Register</Button>
        </form>
      </FormContainer>
    </RegisterContainer>
  );
};

export default RegisterPage;
