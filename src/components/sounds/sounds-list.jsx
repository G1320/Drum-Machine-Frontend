import '../../assets/styles/components/sounds/sounds-list.css';
import React, { useEffect, useState, useRef, createRef } from 'react';
import { getSounds } from '../../services/sound-service';
import { getKitSounds } from '../../services/kit-service';
import SoundDetails from './sound-details';

function SoundsList({ kitId }) {
  const [sounds, setSounds] = useState([]);
  const audioRefs = useRef([]);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const fetchKit = async () => {
      try {
        const sounds = await getSounds();
        const kitSounds = await getKitSounds(kitId);

        setSounds(
          sounds.map((sound) => {
            if (kitSounds.some((kitSound) => kitSound._id === sound._id)) {
              return { ...sound, alert: true };
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
  }, [sounds, kitId]);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <button className="sounds-list-expand-button " onClick={handleToggleExpand}>
        {isExpanded ? 'Collapse' : 'Expand'}
      </button>

      <section className={`sounds-list ${isExpanded ? 'expanded' : 'collapsed'}`}>
        {' '}
        {/* <div> */}
        {sounds.map((sound, index) => (
          <SoundDetails
            key={sound._id}
            sound={sound}
            audioRef={audioRefs.current[index]}
            soundKey={index}
            className={`${sound.alert ? 'alert' : 'Danger'} ${isExpanded ? 'expanded' : ''}`}
          />
        ))}
        {/* </div> */}
      </section>
    </>
  );
}

export default SoundsList;
