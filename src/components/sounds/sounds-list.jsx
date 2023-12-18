import React, { useEffect, useState, useRef, createRef } from 'react';
import '../../assets/styles/components/sounds/sounds-list.scss';
import SoundDetails from './sound-details';
import { getLocalUser } from '../../services/user-service';
import { useSelector } from 'react-redux';

function SoundsList({ kitId }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [sounds, setSounds] = useState([]);
  const audioRefs = useRef([]);
  const user = getLocalUser();

  const kitSounds = useSelector((state) => state.sounds.selectedKitSounds);
  const allSounds = useSelector((state) => state.sounds.allSounds);

  useEffect(() => {
    setSounds(
      allSounds.map((sound) => {
        if (kitSounds.some((kitSound) => kitSound._id === sound._id)) {
          return { ...sound, alert: true };
        }
        return sound;
      })
    );

    audioRefs.current = sounds.map((_, index) => audioRefs.current[index] ?? createRef());
  }, [kitSounds, allSounds]);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      {user && user.isAdmin && (
        <>
          {/* <button className="sounds-list-expand-button " onClick={handleToggleExpand}>
              {isExpanded ? 'Collapse' : 'Expand'}
            </button> */}

          <section className={`sounds-list ${isExpanded ? 'expanded' : 'collapsed'}`}>
            {' '}
            {sounds.map((sound, index) => (
              <SoundDetails
                key={sound._id}
                sound={sound}
                audioRef={audioRefs.current[index]}
                soundKey={index}
                className={`${sound.alert ? 'alert' : 'Danger'} ${isExpanded ? 'expanded' : ''}`}
              />
            ))}
          </section>
        </>
      )}
    </>
  );
}

export default SoundsList;
