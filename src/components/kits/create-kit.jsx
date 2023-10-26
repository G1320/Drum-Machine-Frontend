import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, FormGroup } from '@mui/material';
import { createKit } from '../../services/kit-service';
import { useDispatch } from 'react-redux';
import { setError } from '../../slices/errorSlice';
import { setSuccess } from '../../slices/successSlice';
import '../../assets/styles/components/kits/create-kit.css';

export default function CreateKit() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [kitName, setKitName] = useState('');
  const [description, setDescription] = useState('');

  const addKit = async (kitData) => {
    try {
      const kit = await createKit(kitData);
      dispatch(setSuccess('Kit created successfully!'));
      navigate(`/pages/id/${kit._id}`);
    } catch (error) {
      console.error(error);
      dispatch(setError(error?.response?.data || 'Something went wrong!'));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const kitData = {
      name: kitName,
      description,
      sounds: [],
      subscribers: 0,
    };
    addKit(kitData);
  };

  return (
    <div className="create-kit">
      <Box
        component="form"
        className="create-form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <h3>Create new kit</h3>
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
        <FormGroup>
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </FormGroup>
      </Box>
    </div>
  );
}
