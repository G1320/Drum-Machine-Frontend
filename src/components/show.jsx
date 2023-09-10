import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPageData } from '../services/data-service';
import { updateKit } from '../services/kit-service';
import { useDispatch } from 'react-redux';
import { setError } from '../slices/errorSlice';
import { setSuccess } from '../slices/successSlice';
import { TextField, Button, Box, FormGroup } from '@mui/material';

function Show() {
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [tempData, setTempData] = useState({ name: '', description: '' });
  const [error, setErrorState] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { pageName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pageData = await getPageData(pageName);
        setData(pageData);
        setTempData({ name: pageData.name, description: pageData.description });
      } catch (error) {
        console.error(error);
        setErrorState(true);
      }
    };
    fetchData();
  }, [pageName]);

  const handleUpdate = async () => {
    try {
      const response = await updateKit(data._id, tempData);
      console.log('response: ', response);
      setData(tempData);
      setIsEditing(false);
      dispatch(setSuccess('Data updated successfully!'));
    } catch (error) {
      console.error('Failed to update data', error);
      dispatch(setError(error?.response?.data || 'Failed to update data'));
      throw error;
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
    <div>
      <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
        <FormGroup>
          <TextField
            label="Name"
            variant="outlined"
            value={tempData.name}
            onChange={(e) => setTempData((prevData) => ({ ...prevData, name: e.target.value }))}
            disabled={!isEditing}
          />
        </FormGroup>
        <FormGroup>
          <TextField
            label="Description"
            variant="outlined"
            value={tempData.description}
            onChange={(e) => setTempData((prevData) => ({ ...prevData, description: e.target.value }))}
            disabled={!isEditing}
          />
        </FormGroup>
        {isEditing && (
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        )}
      </Box>

      <h1>{data.subscribers}</h1>
      <Button variant="contained" color="secondary" onClick={handleSubscribe}>
        Subscribe
      </Button>
      <Button variant="contained" color="secondary" onClick={() => setIsEditing(true)}>
        Edit
      </Button>
    </div>
  );
}

export default Show;
