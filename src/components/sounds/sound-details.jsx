import React, { useEffect, useRef } from 'react';
import { playAudio } from '../../services/sound-service';
import { addSoundToKit } from '../../services/sound-service';
import { useParams } from 'react-router-dom';

function SoundDetails({ sound, audioRef }) {
  const { pageId } = useParams();

  const handleClick = () => {
    playAudio(audioRef);
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === sound.keyCode) {
      playAudio(audioRef.current);
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [sound.keyCode]);

  const handleAddToKit = async () => {
    try {
      await addSoundToKit(pageId, sound._id);
      console.log('Sound added to kit!');
    } catch (error) {
      console.error('Failed to add sound to kit', error);
    }
  };

  return (
    <div onClick={handleClick} key={sound.keyCode}>
      <p>{sound.title}</p>
      <audio src={sound.src} ref={audioRef} />
      <img src={sound.img} style={{ maxWidth: '80px' }}></img>
      <button onClick={handleAddToKit}>Add to my Kit</button>
    </div>
  );
}

export default SoundDetails;
