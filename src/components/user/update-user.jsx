import React, { useState, useEffect } from 'react';
import '../../assets/styles/components/user/update-user.scss';
import { Button, TextField, Box, FormGroup } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { updateUser } from '../../services/user-service';
import { useDispatch } from 'react-redux';
import { setError } from '../../slices/errorSlice';
import { setSuccess } from '../../slices/successSlice';

export default function Update() {
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');

  const [avatar, setAvatar] = useState('');
  const [isAdmin, setIsAdmin] = useState('');
  const [id, setID] = useState(null);
  let navigate = useNavigate();

  useEffect(() => {
    setID(localStorage.getItem('ID'));
    setUsername(localStorage.getItem('Username'));
    setEmail(localStorage.getItem('Email'));
    setFirstName(localStorage.getItem('First Name'));
    setLastName(localStorage.getItem('Last Name'));
    setAvatar(localStorage.getItem('Avatar'));
    setIsAdmin(localStorage.getItem('isAdmin'));
  }, []);

  const updateData = async () => {
    try {
      const response = await updateUser(id, {
        username,
        email,
        firstName,
        lastName,
        avatar,
        isAdmin,
        password,
      });
      setSuccess('User updated successfully!');
      navigate('/read');
    } catch (error) {
      dispatch(setError(error?.response?.data || 'Something went wrong!'));
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
          label="isAdmin"
          name="isAdmin"
          variant="outlined"
          value={isAdmin}
          onChange={(e) => setIsAdmin(e.target.value)}
        />
      </FormGroup>
      <Button variant="contained" color="primary" type="submit">
        Submit
      </Button>
    </Box>
  );
}
