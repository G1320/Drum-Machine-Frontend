import React, { useState, useEffect, useRef } from 'react';
import '../styles/drum-machine.css';

const Cell = ({ pad, isActive, toggleActive, audioRef }) => {
  const cellClass = isActive ? 'active' : 'inactive';

  const handleCellClick = () => {
    toggleActive(pad.keyCode);
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reset audio to start if it's clicked again before finishing
      audioRef.current.play();
    }
  };

  return (
    <div className={`drum-cell ${cellClass}`} onClick={handleCellClick}>
      {isActive ? '🎵' : ''} {pad.text}
      <audio
        ref={audioRef}
        className="clip"
        src={pad.src}
        preload="auto"
        onError={() => console.error(`Error loading audio for ${pad.text}`)}
      ></audio>
    </div>
  );
};

const DrumMachine = () => {
  const drumPads = [
    {
      keyCode: 81,
      text: 'Q',
      src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3',
    },
    {
      keyCode: 87,
      text: 'W',
      src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3',
    },
    {
      keyCode: 69,
      text: 'E',
      src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3',
    },
    {
      keyCode: 65,
      text: 'A',
      src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3',
    },
    {
      keyCode: 83,
      text: 'S',
      src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3',
    },
    {
      keyCode: 68,
      text: 'D',
      src: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3',
    },
    {
      keyCode: 90,
      text: 'Z',
      src: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3',
    },
    {
      keyCode: 88,
      text: 'X',
      src: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3',
    },
    {
      keyCode: 67,
      text: 'C',
      src: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3',
    },
  ];

  const [activePad, setActivePad] = useState(null);
  const audioRefs = drumPads.map(() => useRef(null));

  const toggleActive = (keyCode) => {
    if (activePad === keyCode) {
      setActivePad(null);
    } else {
      setActivePad(keyCode);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      const index = drumPads.findIndex((pad) => pad.keyCode === e.keyCode);
      if (index !== -1) {
        toggleActive(drumPads[index].keyCode);
        if (audioRefs[index].current) {
          audioRefs[index].current.currentTime = 0;
          audioRefs[index].current.play();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [drumPads]);

  return (
    <div className="drum-table">
      {drumPads.map((pad, index) => (
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
