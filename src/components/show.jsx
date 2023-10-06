import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPageData } from '../services/data-service';
import { updateKit, deleteKit } from '../services/kit-service';
import { useDispatch } from 'react-redux';
import { setError } from '../slices/errorSlice';
import { setSuccess } from '../slices/successSlice';
import { TextField, Button, Box, FormGroup, Typography, Container } from '@mui/material';
import CreateKit from './create-kit';
import { addKitToUser, getLocalUser } from '../services/user-service';

function Show() {
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [tempData, setTempData] = useState({ name: '', description: '' });
  const [error, setErrorState] = useState(false);

  const { pageId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pageData = await getPageData(pageId);
        setData(pageData);
        setTempData({ name: pageData.name, description: pageData.description });
      } catch (error) {
        console.error(error);
        setErrorState(true);
      }
    };
    fetchData();
  }, [pageId]);

  const handleUpdate = async () => {
    if (tempData.name === data.name && tempData.description === data.description) {
      dispatch(setError('No changes were made, please try again.'));
      return;
    }
    try {
      const response = await updateKit(data._id, tempData);
      console.log('response: ', response);
      setData(tempData);
      dispatch(setSuccess('Kit updated successfully!'));
    } catch (error) {
      console.error('Failed to update kit', error);
      dispatch(setError('Failed to update kit'));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteKit(data._id);
      dispatch(setSuccess('Data deleted successfully!'));
      setTempData({ name: '', description: '' });
      // navigate('/pages/about');
    } catch (error) {
      console.error('Failed to delete kit', error);
      dispatch(setError(error?.response?.data || 'Failed to delete data'));
    }
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
      dispatch(setError('Please log in to add kits to your account.'));
    }
  };

  if (error) {
    return <div>Error loading page. Please try again later.</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  const handleSubscribe = () => {
    console.log('Subscribed');
  };

  return (
    <Container>
      <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} sx={{ my: 2 }}>
        <FormGroup>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={tempData.name}
            onChange={(e) => setTempData((prevData) => ({ ...prevData, name: e.target.value }))}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={tempData.description}
            onChange={(e) => setTempData((prevData) => ({ ...prevData, description: e.target.value }))}
          />
        </FormGroup>
        <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
          Submit
        </Button>
      </Box>

      <Typography variant="h6" gutterBottom>
        Subscribers: {data.subscribers}
      </Typography>
      <Button variant="contained" color="secondary" onClick={handleSubscribe} sx={{ mr: 2 }}>
        Subscribe
      </Button>
      <Button variant="contained" color="error" onClick={handleDelete} sx={{ mr: 2 }}>
        Delete
      </Button>
      <Button variant="contained" onClick={handleAddToKits} sx={{ mr: 2 }}>
        Add to my kits
      </Button>
      <CreateKit />
    </Container>
  );
}

export default Show;
