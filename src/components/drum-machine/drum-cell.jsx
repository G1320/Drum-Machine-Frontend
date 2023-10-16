import React from 'react';
import { playAudio } from '../../services/sound-service';

const Cell = ({ pad, isActive, toggleActive, audioRef }) => {
  const cellClass = isActive ? 'active' : 'inactive';

  const handleCellClick = () => {
    toggleActive(pad.keyCode);
    playAudio(audioRef);
  };

  return (
    <div className={`drum-cell ${cellClass}`} onClick={handleCellClick}>
      {isActive ? '🎵' : ''} {pad.text}
      <audio
        ref={audioRef}
        className="clip"
        src={pad.src}
        preload="auto"
        onError={(e) => console.error(`Error loading audio for ${pad.text}`, e)}
      ></audio>
    </div>
  );
};

export default Cell;
