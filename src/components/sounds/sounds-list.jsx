import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import { getKitSounds } from '../../services/kit-service';

function SoundsList({ kitId }) {
  const [sounds, setSounds] = useState([]);

  useEffect(() => {
    const fetchKit = async () => {
      try {
        const sounds = await getKitSounds(kitId);
        setSounds(sounds);
      } catch (error) {}
    };
    fetchKit();
  }, [kitId]);

  return (
    <section>
      {sounds.map((sound) => (
        <div key={sound._id}>
          <Typography variant="body1">{sound.title}</Typography>
          <img src={sound.img} alt={sound.title} style={{ width: '80px', height: '40px' }} />
        </div>
      ))}
    </section>
  );
}

export default SoundsList;
