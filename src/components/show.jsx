import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPageData } from '../services/data-service';
import { updateKit, deleteKit } from '../services/kit-service';
import { useDispatch } from 'react-redux';
import { setError } from '../slices/errorSlice';
import { setSuccess } from '../slices/successSlice';
import { TextField, Button, Box, FormGroup, Typography, Container } from '@mui/material';
import CreateKit from './create-kit';

function Show() {
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [tempData, setTempData] = useState({ name: '', description: '' });
  const [error, setErrorState] = useState(false);

  const { pageId } = useParams();
  const navigate = useNavigate();

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
      dispatch(setError('No changes were made.'));
      return;
    }
    try {
      const response = await updateKit(data._id, tempData);
      console.log('response: ', response);
      setData(tempData);
      dispatch(setSuccess('Data updated successfully!'));
    } catch (error) {
      console.log('Failed to update data', error);
      dispatch(setError(error?.response?.data || 'Failed to update data'));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteKit(data._id);
      dispatch(setSuccess('Data deleted successfully!'));
      setTempData({ name: '', description: '' });
      // navigate('/pages/about');
    } catch (error) {
      console.error('Failed to delete data', error);
      dispatch(setError(error?.response?.data || 'Failed to delete data'));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate();
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
      <CreateKit />
    </Container>
  );
}

export default Show;
