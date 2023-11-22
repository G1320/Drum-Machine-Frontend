import React, { useEffect, useState, useRef, createRef } from 'react';
import '../../assets/styles/components/sounds/sounds-list.scss';
import { getSounds } from '../../services/sound-service';
import { getKitSounds } from '../../services/kit-service';
import SoundDetails from './sound-details';
import { getLocalUser } from '../../services/user-service';

function SoundsList({ kitId }) {
  const [sounds, setSounds] = useState([]);
  const audioRefs = useRef([]);
  const [isExpanded, setIsExpanded] = useState(true);
  const user = getLocalUser();

  useEffect(() => {
    const fetchKit = async () => {
      try {
        const sounds = await getSounds(); //All sounds
        const kitSounds = await getKitSounds(kitId); //Currently selected kit sounds

        setSounds(
          sounds.map((sound) => {
            if (kitSounds.some((kitSound) => kitSound._id === sound._id)) {
              return { ...sound, alert: true }; // if the sound is in the kit, add an alert property to the sound object
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
