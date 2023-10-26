import '../../assets/styles/components/sounds/sounds-list.css';
import React, { useEffect, useState, useRef, createRef } from 'react';
import { getSounds } from '../../services/sound-service';
import SoundDetails from './sound-details';

function SoundsList({ kitId }) {
  const [sounds, setSounds] = useState([]);
  const audioRefs = useRef([]);

  useEffect(() => {
    const fetchKit = async () => {
      try {
        const sounds = await getSounds();
        setSounds(sounds);

        audioRefs.current = sounds.map((_, index) => audioRefs.current[index] ?? createRef());
      } catch (error) {
        console.error('Failed to load kit', error);
      }
    };
    fetchKit();
  }, [kitId]);

  return (
    <section className="sounds-list">
      {sounds.map((sound, index) => (
        <SoundDetails
          key={sound._id}
          sound={sound}
          audioRef={audioRefs.current[index]}
          soundKey={index}
        />
      ))}
    </section>
  );
}

export default SoundsList;
