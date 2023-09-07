import React, { useState, useEffect } from 'react';
import { Button, TextField, Box, FormGroup } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../services/user-service';
// import showErrorAlert from '../helpers/showErrorAlert';
import { useDispatch } from 'react-redux';
import { setError } from '../slices/errorSlice'; // Adjust the path to your slice file

import '../styles/create.css';

export default function Update() {
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');

  const [avatar, setAvatar] = useState('');
  const [role, setRole] = useState('');
  const [id, setID] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    setID(localStorage.getItem('ID'));
    setUsername(localStorage.getItem('Username'));
    setEmail(localStorage.getItem('Email'));
    setFirstName(localStorage.getItem('First Name'));
    setLastName(localStorage.getItem('Last Name'));
    setAvatar(localStorage.getItem('Avatar'));
    setRole(localStorage.getItem('Role'));
  }, []);

  const handleError = (error) => {
    dispatch(setError(error.response?.data || 'Something went wrong!'));
  };

  const updateData = async () => {
    try {
      const response = await updateUser(id, {
        username,
        email,
        firstName,
        lastName,
        avatar,
        role,
        password,
      });
      console.log('response: ', response);
      navigate('/read');
    } catch (error) {
      handleError(error);
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateData();
  };

  return (
    <Box component="form" className="create-form" noValidate autoComplete="off" onSubmit={handleSubmit}>
      <FormGroup>
        <TextField
          label="Username"
          name="username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <TextField
          label="Email"
          name="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <TextField
          label="First Name"
          name="firstName"
          variant="outlined"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <TextField
          label="Last Name"
          name="lastName"
          variant="outlined"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <TextField
          label="Password"
          name="password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <TextField
          label="Avatar URL"
          name="avatar"
          variant="outlined"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <TextField
          label="Role"
          name="role"
          variant="outlined"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
      </FormGroup>
      <Button variant="contained" color="primary" type="submit">
        Submit
      </Button>
    </Box>
  );
}
