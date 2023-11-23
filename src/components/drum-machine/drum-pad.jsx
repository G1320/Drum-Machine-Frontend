import React, { useEffect } from 'react';
import '../../assets/styles/components/drum-machine/drum-pad.scss';

import { playAudio } from '../../services/sound-service';

const DrumPad = ({ sound, toggleActive, isActive, audioRef, keyCode }) => {
  const handleKeyDown = (e) => {
    if (e.code === keyCode) {
      toggleActive(keyCode);
      playAudio(audioRef);
    }
  };

  const handleKeyUp = (e) => {
    if (e.code === keyCode) {
      toggleActive(null);
    }
  };

  const handleMouseDown = () => {
    toggleActive(keyCode);
    playAudio(audioRef);
  };

  const handleMouseUp = () => {
    toggleActive(null);
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      handleMouseUp();
    };

    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [handleMouseUp]);

  return (
    <article className={`drum-Pad ${isActive ? 'active' : ''}`} onMouseDown={handleMouseDown}>
      <p>{sound.title}</p>
      <audio src={sound.src} ref={audioRef} />
    </article>
  );
};

export default DrumPad;
