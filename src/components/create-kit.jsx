import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, FormGroup } from '@mui/material';
import { createKit } from '../services/kit-service';
import { useDispatch } from 'react-redux';
import { setError } from '../slices/errorSlice';
import '../styles/create.css';

export default function CreateKit() {
  const dispatch = useDispatch();

  const [kitName, setKitName] = useState('');
  const [description, setDescription] = useState('');
  const [sounds, setSounds] = useState([{ name: '', src: '', keyCode: '' }]);

  // let navigate = useNavigate();

  const handleError = (error) => {
    dispatch(setError(error?.response?.data || 'Something went wrong!'));
  };

  const addKit = async (kit) => {
    try {
      await createKit(kit);
      // navigate(`/kits/${kitName}`);
    } catch (error) {
      handleError(error);
      console.error(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const kit = {
      name: kitName,
      description,
      sounds,
      subscribers: 0,
    };
    console.log('kit: ', kit);

    addKit(kit);
  };

  return (
    <Box component="form" className="create-form" noValidate autoComplete="off" onSubmit={handleSubmit}>
      <FormGroup>
        <TextField
          label="Kit Name"
          variant="outlined"
          value={kitName}
          onChange={(e) => setKitName(e.target.value)}
        />
      </FormGroup>
      <FormGroup>
        <TextField
          label="Description"
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormGroup>
      {/* Add other fields for each property in the sound objects in the sounds array here */}
      <FormGroup>
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
      </FormGroup>
    </Box>
  );
}
