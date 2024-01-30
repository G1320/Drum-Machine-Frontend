import React, { useState } from 'react';
import '../../assets/styles/components/kits/create-kit.scss';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Box, FormGroup, CircularProgress } from '@mui/material';
import { createKit } from '../../services/kit-service';
import { getLocalUser } from '../../services/user-service';
import { useDispatch } from 'react-redux';
import { setError } from '../../slices/errorSlice';
import { setSelectedKit } from '../../slices/kitsSlice';

export default function CreateKit() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = getLocalUser();

  const [kitName, setKitName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addKit = async (kitData) => {
    if (isLoading) return;
    if (!user) {
      dispatch(setError('Please log in to create a new kit'));
      return;
    }
    try {
      setIsLoading(true);

      const kit = await createKit(user._id, kitData);
      // dispatch(setSuccess('Kit created successfully!'));
      dispatch(setSelectedKit(kit));
      setDescription('');
      setKitName('');
      navigate(`/sequencer/id/${kit._id}`);
    } catch (error) {
      console.error(error);
      dispatch(setError(error?.response?.data || 'Something went wrong!'));
    } finally {
      setIsLoading(false);
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
              style: { color: 'white' },
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
              style: { color: 'white' },
            }}
          />
        </FormGroup>
        <FormGroup>
          {/* <Button variant="contained" color="primary" type="submit">
            Create a new Kit
          </Button> */}
          <Button type="submit" variant="contained" disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} /> : 'Create Kit'}
          </Button>
        </FormGroup>
      </Box>
    </section>
  );
}
