import '../../assets/styles/components/sounds/sounds-list.css';
import React, { useEffect, useState, useRef, createRef } from 'react';
import { getSounds } from '../../services/sound-service';
import { getKitSounds } from '../../services/kit-service';
import SoundDetails from './sound-details';

function SoundsList({ kitId }) {
  const [sounds, setSounds] = useState([]);
  const audioRefs = useRef([]);

  useEffect(() => {
    const fetchKit = async () => {
      try {
        const sounds = await getSounds();
        const kitSounds = await getKitSounds(kitId);

        setSounds(
          sounds.map((sound) => {
            if (kitSounds.some((kitSound) => kitSound._id === sound._id)) {
              sound = { ...sound, alert: true };
              return sound;
            }
            return sound;
          })
        );

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
          className={sound.alert ? 'alert' : 'Danger'}
        />
      ))}
    </section>
  );
}

export default SoundsList;
