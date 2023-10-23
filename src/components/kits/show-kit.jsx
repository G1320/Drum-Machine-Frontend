// import React from 'react';
// import { useParams } from 'react-router-dom';
// import {
//   TextField,
//   Button,
//   Box,
//   FormGroup,
//   Typography,
//   Container,
//   CircularProgress,
// } from '@mui/material';
// import { useDispatch } from 'react-redux';

// import { addKitToUser } from '../../services/user-service';
// import { setError } from '../../slices/errorSlice';
// import { setSuccess } from '../../slices/successSlice';
// import { getKit } from '../../services/kit-service';
// import SoundsList from '../sounds/sounds-list';

// function ShowKit() {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const { data, isLoading, error } = getKit(id);

//   const handleUpdate = () => {
//     console.log('Update');
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     handleUpdate();
//   };

//   const handleAddToKits = async () => {
//     const user = getLocalUser();

//     if (user) {
//       try {
//         await addKitToUser(user._id, data._id);
//         dispatch(setSuccess('Kit added to your kits!'));
//       } catch (error) {
//         console.error('Failed to add kit to user', error);
//         dispatch(setError(error?.response?.data || 'Failed to add kit to user'));
//       }
//     } else {
//       dispatch(setError('Please log in to add kits to your account.'));
//     }
//   };

//   if (!data || error) {
//     return (
//       <div className="loader-container">
//         <CircularProgress />
//       </div>
//     );
//   }

//   const handleSubscribe = () => {
//     console.log('Subscribed');
//   };

//   return (
//     <Container className="show-kit-container">
//       <Box component="form" noValidate onSubmit={handleSubmit}>
//         <h1>{data.title}</h1>
//         <p>{data.description}</p>
//         <button type="submit">Update</button>
//         <button type="button" onClick={handleAddToKits}>
//           Add to My Kits
//         </button>
//         <button type="button" onClick={handleSubscribe}>
//           Subscribe
//         </button>
//       </Box>
//       <SoundsList kitId={id} />
//     </Container>
//   );
// }

// export default ShowKit;

import React, { useEffect, useState } from 'react';
import '../../assets/styles/components/kits/show-kit.css';
import { useParams } from 'react-router-dom';
import { getPageData } from '../../services/data-service';
import { updateKit, deleteKit, getKitSounds } from '../../services/kit-service';
import { useDispatch } from 'react-redux';
import { setError } from '../../slices/errorSlice';
import { setSuccess } from '../../slices/successSlice';
import {
  TextField,
  Button,
  Box,
  FormGroup,
  Typography,
  Container,
  CircularProgress,
} from '@mui/material';
import { addKitToUser, getLocalUser } from '../../services/user-service';

function Show() {
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [tempData, setTempData] = useState({ name: '', description: '' });
  const [error, setErrorState] = useState(false);
  const [sounds, setSounds] = useState([]);

  const { pageId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pageData = await getPageData(pageId);
        setData(pageData);
        setTempData({ name: pageData.name, description: pageData.description });

        const sounds = await getKitSounds(pageId);
        setSounds(sounds);
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
      await updateKit(data._id, tempData);
      setData(tempData);
      dispatch(setSuccess('Kit updated successfully!'));
    } catch (error) {
      console.error('Failed to update kit', error);
      dispatch(setError(error?.response?.data || 'Failed to update kit'));
    }
  };

  const handleDelete = async () => {
    try {
      await deleteKit(data._id);
      dispatch(setSuccess('Data deleted successfully!'));
      setTempData({ name: '', description: '' });
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

  if (!data || error) {
    return (
      <div className="loader-container">
        <CircularProgress />
      </div>
    );
  }

  const handleSubscribe = () => {
    console.log('Subscribed');
  };

  return (
    <Container className="show-kit-container">
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
        color={'secondary'}
        sx={{ my: 2 }}
      >
        <FormGroup>
          <TextField
            label="Kit name"
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
            rows={3}
            value={tempData.description}
            onChange={(e) => setTempData((prevData) => ({ ...prevData, description: e.target.value }))}
          />
        </FormGroup>
        <Button variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
          Submit
        </Button>
      </Box>

      <Typography variant="h6" gutterBottom>
        Sounds:
      </Typography>
      {sounds.map((sound) => (
        <div key={sound._id}>
          <Typography variant="body1">{sound.title}</Typography>
          <img src={sound.img} alt={sound.title} style={{ width: '80px', height: '40px' }} />
        </div>
      ))}

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
    </Container>
  );
}

export default Show;
