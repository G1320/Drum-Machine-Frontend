import React, { useEffect, useState } from 'react';
import '../../assets/styles/components/kits/show-kit.scss';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import { getPageData } from '../../services/data-service';
import { updateKit, deleteKit } from '../../services/kit-service';
import { setError } from '../../slices/errorSlice';
import { setSuccess } from '../../slices/successSlice';
import { TextField, Button, Box, FormGroup, Container, CircularProgress } from '@mui/material';
import { addKitToUser, getLocalUser } from '../../services/user-service';
import Loader from '../misc/loader';
import UserKitsList from '../kits/user-kits-list';
import AudioVisualizer from '../visualizer/audio-visualizer';

function Show() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [tempData, setTempData] = useState({ name: '', description: '' });

  const { kitId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pageData = await getPageData(kitId);
        setData(pageData);
        setTempData({ name: pageData.name, description: pageData.description });
      } catch (error) {
        console.error('Failed to Get Page Data', error);
        dispatch(setError(error?.response?.data || 'Failed to load kit'));
      }
    };
    fetchData();
  }, [kitId]);

  const handleUpdate = async () => {
    if (tempData.name === data.name && tempData.description === data.description) {
      dispatch(setError('No changes were made, please try again.'));
      return;
    }
    try {
      await updateKit(data._id, tempData);
      setData(tempData);
      dispatch(setSuccess('Kit updated successfully!'));
    } catch (error) {
      console.error('Failed to update kit', error);
      dispatch(setError(error?.response?.data || 'Failed to update kit'));
    }
  };

  const handleDeleteKit = async () => {
    try {
      await deleteKit(data._id);
      dispatch(setSuccess('Kit deleted successfully!'));
      setTempData({ name: '', description: '' });
      navigate('/pages/id/64e61e8b7aecdc67f8632329');
    } catch (error) {
      console.error('Failed to delete kit', error);
      dispatch(setError(error?.response?.data || 'Failed to delete data'));
    }
  };

  const handleLoadToDrumMachine = () => {
    navigate(`/drum/id/${data._id}`);
  };
  const handleLoadToSequencer = () => {
    navigate(`/sequencer/id/${data._id}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate();
  };

  const handleAddToKits = async () => {
    const user = getLocalUser();

    if (user) {
      try {
        await addKitToUser(user._id, data._id);
        dispatch(setSuccess('Kit added to your kits!'));
      } catch (error) {
        console.error('Failed to add kit to user', error);
        dispatch(setError(error?.response?.data || 'Failed to add kit to user'));
      }
    } else {
      dispatch(setError('Please log in to add a Kit to your Kits!'));
    }
  };

  if (!data) {
    return <Loader />;
  }

  return (
    <>
      <Container className="edit-kit-container">
        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} color={'secondary'}>
          <FormGroup>
            <TextField
              label="Kit name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={tempData.name}
              onChange={(e) => setTempData((prevData) => ({ ...prevData, name: e.target.value }))}
              InputProps={{
                style: { color: 'white' },
              }}
            />
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              value={tempData.description}
              onChange={(e) => setTempData((prevData) => ({ ...prevData, description: e.target.value }))}
              InputProps={{
                style: { color: 'white' },
              }}
            />
          </FormGroup>
          <Button variant="contained" color="primary" type="submit">
            Update
          </Button>
        </Box>
        <Button variant="contained" onClick={handleLoadToDrumMachine}>
          Load drum machine
        </Button>
        <Button variant="contained" onClick={handleLoadToSequencer}>
          Load Sequencer
        </Button>

        <Button variant="contained" color="error" onClick={handleDeleteKit}>
          Delete
        </Button>
        <Button variant="contained" onClick={handleAddToKits}>
          Add to my kits
        </Button>
      </Container>
      <section className="main-content-bottom-wrapper">
        <UserKitsList />
        <AudioVisualizer />
      </section>
    </>
  );
}

export default Show;
