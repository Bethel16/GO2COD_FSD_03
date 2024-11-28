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
  height: 100vh;
  background: #f4f4f4;
`;

const FormContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #ddd;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    background: #45a049;
  }
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Check if passwords match
    if (formData.password !== formData.password2) {
      alert("Passwords do not match!");
      return;
    }
  
    // Prepare FormData
    const formDataToSend = new FormData();
    formDataToSend.append('username', formData.username);
    formDataToSend.append('first_name', formData.first_name);
    formDataToSend.append('last_name', formData.last_name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    const csrfToken = getCSRFToken(); // Get CSRF token from cookie
  
    try {
      const response = await axios.post('http://localhost:8000/api/register/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data', // Required for file uploads
          'X-CSRFToken': csrfToken || '', // Include CSRF token in headers
        },
      });
      console.log('User registered:', response.data);
      // Optionally handle the success (redirect, show success message, etc.)
    } catch (error) {
      console.error('Registration failed:', error);
      // Handle error (show error message, etc.)
    }
  };
  

  return (
    <RegisterContainer>
      <FormContainer>
        <Title>Register</Title>
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
