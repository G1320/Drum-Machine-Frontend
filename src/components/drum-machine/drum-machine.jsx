import React, { useState, useEffect, useRef } from 'react';
import Cell from './drum-cell';
import { playAudio } from '../../services/sound-service';
import '../../assets/styles/components/drum-machine/drum-machine.css';

import drumPadsConfig from '../../config/drum-machineConfig';

import { getKitSounds, getKit } from '../../services/kit-service';
import { useParams } from 'react-router-dom';
const DrumMachine = () => {
  const { kitId } = useParams();
  console.log('kitId: ', kitId);

  // const [drumPadsConfig, setDrumPadsConfig] = useState([]);
  // useEffect(() => {
  //   getKitSounds(kitId).then((sounds) => {
  //     setDrumPadsConfig(sounds);
  //   });
  // }, [kitId]);

  const [activePad, setActivePad] = useState(null);

  const audioRefs = drumPadsConfig.map(() => useRef(null));

  const toggleActive = (keyCode) => {
    if (activePad === keyCode) {
      setActivePad(null);
    } else {
      setActivePad(keyCode);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      const index = drumPadsConfig.findIndex((pad) => pad.keyCode === e.keyCode);
      if (index !== -1) {
        toggleActive(drumPadsConfig[index].keyCode);
        playAudio(audioRefs[index]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [drumPadsConfig]);

  return (
    <div className="drum-table">
      {drumPadsConfig.map((pad, index) => (
        <Cell
          key={pad.keyCode}
          pad={pad}
          isActive={activePad === pad.keyCode}
          toggleActive={toggleActive}
          audioRef={audioRefs[index]}
        />
      ))}
    </div>
  );
};

export default DrumMachine;
