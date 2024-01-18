import React, { useState } from 'react';
import '../../assets/styles/components/user/create-user.scss';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, FormControlLabel, Checkbox, Box, FormGroup } from '@mui/material';
import { register } from '../../services/auth-service';
import { useDispatch } from 'react-redux';
import { setError } from '../../slices/errorSlice';
import { setSuccess } from '../../slices/successSlice';

export default function Create() {
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  let navigate = useNavigate();

  const postData = async () => {
    try {
      await register({
        username,
        email,
        password,
        firstName,
        lastName,
        isAdmin,
      });
      dispatch(setSuccess('User created successfully!'));
      navigate('/read');
    } catch (error) {
      dispatch(setError(error?.response?.data || 'Something went wrong!'));
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    postData();
  };

  return (
    <Box component="form" className="create-form" noValidate autoComplete="off" onSubmit={handleSubmit}>
      <h3>Create new user</h3>
      <FormGroup>
        <TextField
          label="Username"
          name="username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          InputProps={{
            style: { color: 'white' },
          }}
        />
      </FormGroup>
      <FormGroup>
        <TextField
          label="Email"
          name="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            style: { color: 'white' },
          }}
        />
      </FormGroup>
      <FormGroup>
        <TextField
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            style: { color: 'white' },
          }}
        />
      </FormGroup>
      <FormGroup>
        <TextField
          label="First Name"
          name="firstName"
          variant="outlined"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          InputProps={{
            style: { color: 'white' },
          }}
        />
      </FormGroup>
      <FormGroup>
        <TextField
          label="Last Name"
          name="lastName"
          variant="outlined"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          InputProps={{
            style: { color: 'white' },
          }}
        />
      </FormGroup>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />}
          label="Admin access"
          id="isAdmin"
          name="isAdmin"
          InputProps={{
            style: { color: 'white' },
          }}
        />
      </FormGroup>
      <Button variant="contained" color="primary" type="submit">
        Submit
      </Button>
    </Box>
  );
}
