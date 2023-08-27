import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, FormControlLabel, Checkbox, Box, FormGroup } from '@mui/material';
import { createUser } from '../services/user-service';
import '../styles/create.css';

export default function Create() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [terms, setTerms] = useState(false);

  let navigate = useNavigate();

  const postData = async () => {
    try {
      await createUser({
        username,
        email,
        password,
        firstName,
        lastName,
        terms,
      });
      navigate('/read');
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    postData();
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
          label="Password"
          name="password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        <FormControlLabel
          control={<Checkbox checked={terms} onChange={(e) => setTerms(e.target.checked)} />}
          label="I agree to the Terms and Conditions"
          id="terms"
          name="terms"
        />
      </FormGroup>
      <Button variant="contained" color="primary" type="submit">
        Submit
      </Button>
    </Box>
  );
}
