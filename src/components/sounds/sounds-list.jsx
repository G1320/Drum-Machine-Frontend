import React from 'react';
import {
  TextField,
  Button,
  Box,
  FormGroup,
  Typography,
  Container,
  CircularProgress,
} from '@mui/material';
import { getKitSounds } from '../../services/kit-service';

function SoundsList({ kitId }) {
  const { data: sounds, isLoading } = getKitSounds(kitId);

  if (isLoading) {
    return (
      <div className="loader-container">
        <CircularProgress />
      </div>
    );
  }

  return (
    <ul>
      {sounds.data.map((sound) => (
        <li key={sound._id}>
          <h2>{sound.title}</h2>
          <audio src={sound.url} controls />
        </li>
      ))}
    </ul>
  );
}

export default SoundsList;
