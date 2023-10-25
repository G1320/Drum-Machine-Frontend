import React, { useState, useEffect, useRef, createRef } from 'react';
import '../../assets/styles/components/drum-machine/drum-machine.css';
import { getKitSounds } from '../../services/kit-service';
import { useParams } from 'react-router-dom';
import drumMachineDefaultConfig from '../../config/drumMachineDefaultConfig';
import SoundsList from '../sounds/sounds-list';
import Pad from './drum-pad';

const DrumMachine = () => {
  const { kitId } = useParams();
  const [activePad, setActivePad] = useState(null);
  const [sounds, setSounds] = useState([]);

  const audioRefs = useRef([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let fetchedSounds;
        if (kitId) {
          fetchedSounds = await getKitSounds(kitId);
          console.log('fetchedSounds: ', fetchedSounds);
          if (fetchedSounds.length === 0) fetchedSounds = drumMachineDefaultConfig;
        } else {
          console.log('drumMachineDefaultConfig: ', drumMachineDefaultConfig);
          fetchedSounds = drumMachineDefaultConfig;
        }
        setSounds(fetchedSounds);
        audioRefs.current = fetchedSounds.map((_, index) => audioRefs.current[index] ?? createRef());
      } catch (error) {}
    };

    fetchData();
  }, [kitId]);

  const toggleActive = (keyCode) => {
    if (activePad === keyCode) {
      setActivePad(null);
    } else {
      setActivePad(keyCode);
    }
  };

  return (
    <section>
      <div className="drum-table">
        {sounds.map((sound, index) => (
          <Pad
            key={sound.keyCode}
            sound={sound}
            isActive={activePad === sound.keyCode}
            toggleActive={toggleActive}
            audioRef={audioRefs.current[index]}
          />
        ))}
      </div>
      <SoundsList kitId={kitId} />
    </section>
  );
};

export default DrumMachine;
