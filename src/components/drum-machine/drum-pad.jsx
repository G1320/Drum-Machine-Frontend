import '../../assets/styles/components/drum-machine/drum-pad.css';

import React, { useEffect } from 'react';
import { playAudio } from '../../services/sound-service';

const Pad = ({ sound, toggleActive, isActive, audioRef, keyCode }) => {
  const handleKeyPress = (e) => {
    if (e.keyCode === keyCode) {
      console.log('e.keyCode: ', e.keyCode);
      toggleActive(keyCode);
      playAudio(audioRef);
    }
  };

  const handleClick = () => {
    toggleActive(keyCode);
    playAudio(audioRef);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return (
    <article className={`drum-Pad ${isActive ? 'active' : ''}`} onClick={handleClick}>
      <p>{sound.title}</p>
      <audio src={sound.src} ref={audioRef} />
    </article>
  );
};

export default Pad;
