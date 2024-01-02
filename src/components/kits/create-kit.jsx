import React, { useState } from 'react';
import '../../assets/styles/components/kits/create-kit.scss';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, FormGroup } from '@mui/material';
import { createKit } from '../../services/kit-service';
import { getLocalUser } from '../../services/user-service';
import { useDispatch } from 'react-redux';
import { setError } from '../../slices/errorSlice';
import { setSuccess } from '../../slices/successSlice';
import { setSelectedKit } from '../../slices/kitsSlice';

export default function CreateKit() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = getLocalUser();

  const [kitName, setKitName] = useState('');
  const [description, setDescription] = useState('');

  const addKit = async (kitData) => {
    try {
      const kit = await createKit(user._id, kitData);
      dispatch(setSuccess('Kit created successfully!'));
      dispatch(setSelectedKit(kit));

      navigate(`/sequencer/id/${kit._id}`);
      setDescription('');
      setKitName('');
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
      isCustom: true,
    };
    addKit(kitData);
  };

  return (
    <section className="create-kit">
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
            InputProps={{
              style: { color: 'white' }, // Change the color here
            }}
          />
        </FormGroup>
        <FormGroup>
          <TextField
            label="Description"
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            InputProps={{
              style: { color: 'white' }, // Change the color here
            }}
          />
        </FormGroup>
        <FormGroup>
          <Button variant="contained" color="primary" type="submit">
            Create a new Kit
          </Button>
        </FormGroup>
      </Box>
    </section>
  );
}
