// import '../../assets/styles/components/sounds/sound-details.css';
import React, { useEffect, useRef } from 'react';
import { playAudio } from '../../services/sound-service';
import { addSoundToKit, removeSoundFromKit } from '../../services/sound-service';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { setError } from '../../slices/errorSlice';

function SoundDetails({ sound, audioRef, className }) {
  const { pageId } = useParams();
  const dispatch = useDispatch();

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
      dispatch(setError(error.response.data || 'Failed to add sound to kit'));
    }
  };
  const handleRemoveFromKit = async () => {
    try {
      await removeSoundFromKit(pageId, sound._id);
      console.log('Sound added to kit!');
    } catch (error) {
      console.error('Failed to add sound to kit', error);
      dispatch(setError(error.response.data || 'Failed to add sound to kit'));
    }
  };

  return (
    <div className={className} key={sound.keyCode}>
      <p>{sound.title}</p>
      <audio src={sound.src} ref={audioRef} />
      {/* <img src={sound.img} style={{ maxWidth: '80px' }}></img> */}
      <button onClick={handleClick}>Preview sound</button>
      <button onClick={handleAddToKit}>Add to Kit</button>
      <button onClick={handleRemoveFromKit}>Remove from Kit</button>
    </div>
  );
}

export default SoundDetails;
