import React, { useState, useEffect, useRef, createRef } from 'react';
import '../../assets/styles/components/drum-machine/drum-machine.css';
import { getKitSounds } from '../../services/kit-service';
import { useParams } from 'react-router-dom';
import drumMachineDefaultConfig from '../../config/drumMachineDefaultConfig';
import Pad from './drum-pad';

const DrumMachine = () => {
  const { kitId } = useParams();
  const [activePad, setActivePad] = useState(null);
  const [sounds, setSounds] = useState([]);

  const audioRefs = useRef([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let kitSounds;
        if (kitId) {
          kitSounds = await getKitSounds(kitId);
          console.log('kitSounds: ', kitSounds);
          if (kitSounds.length === 0) kitSounds = drumMachineDefaultConfig;
        } else {
          console.log('drumMachineDefaultConfig: ', drumMachineDefaultConfig);
          kitSounds = drumMachineDefaultConfig;
        }
        setSounds(kitSounds);
        audioRefs.current = kitSounds.map((_, index) => audioRefs.current[index] ?? createRef());
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
            key={sound._id}
            sound={sound}
            isActive={activePad === sound.keyCode}
            toggleActive={toggleActive}
            audioRef={audioRefs.current[index]}
          />
        ))}
      </div>
    </section>
  );
};

export default DrumMachine;
