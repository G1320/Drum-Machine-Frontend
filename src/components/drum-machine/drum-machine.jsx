import React, { useState, useEffect, useRef, createRef } from 'react';
import '../../assets/styles/components/drum-machine/drum-machine.css';
import { Button } from '@mui/material';
import { getKitSounds } from '../../services/kit-service';
import { useParams, useNavigate } from 'react-router-dom';
import drumMachineDefaultConfig from '../../config/drumMachineDefaultConfig';
import Pad from './drum-pad';

const DrumMachine = () => {
  const { kitId } = useParams();
  const [activePad, setActivePad] = useState('81');
  const [sounds, setSounds] = useState([]);

  const audioRefs = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let kitSounds;
        if (kitId) {
          kitSounds = await getKitSounds(kitId);
          if (!kitSounds.length) kitSounds = drumMachineDefaultConfig;
        } else {
          kitSounds = drumMachineDefaultConfig;
        }
        console.log('kitSounds: ', kitSounds);
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

  const handleNavigateToEdit = () => {
    navigate(`/pages/id/${kitId}`);
  };

  return (
    <section>
      <div className="drum-table">
        {sounds.map((sound, index) => (
          <Pad
            key={sound._id}
            keyCode={drumMachineDefaultConfig[index].keyCode.toString()}
            sound={sound}
            isActive={activePad === drumMachineDefaultConfig[index].keyCode.toString()}
            toggleActive={toggleActive}
            audioRef={audioRefs.current[index]}
          />
        ))}
      </div>
      <Button variant="contained" onClick={handleNavigateToEdit}>
        Edit kit / Add sounds
      </Button>
    </section>
  );
};

export default DrumMachine;
