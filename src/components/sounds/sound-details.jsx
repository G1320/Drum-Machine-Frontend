import '../../assets/styles/components/sounds/sound-details.css';
import React, { useEffect } from 'react';
import { playAudio } from '../../services/sound-service';
import { addSoundToKit, removeSoundFromKit } from '../../services/sound-service';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { faVolumeHigh, faXmark, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { setError } from '../../slices/errorSlice';

function SoundDetails({ sound, audioRef, className }) {
  let { kitId, pageId } = useParams();
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
    if (sound.alert) return handleRemoveFromKit();
    try {
      await addSoundToKit(kitId || pageId, sound._id);
    } catch (error) {
      console.error('Failed to add sound to kit', error);
      dispatch(setError(error.response.data || 'Failed to add sound to kit'));
    }
  };
  const handleRemoveFromKit = async () => {
    try {
      await removeSoundFromKit(kitId || pageId, sound._id);
    } catch (error) {
      console.error('Failed to remove sound from kit', error);
      dispatch(setError(error.response.data || 'Failed to add sound to kit'));
    }
  };

  return (
    <article className={className + ' sound-details'} key={sound.keyCode}>
      <p className="sound-title">{sound.title}</p>
      <audio src={sound.src} ref={audioRef} />
      <button onClick={handleClick}>
        <FontAwesomeIcon className="preview-icon" icon={faVolumeHigh} size="2xs" />
      </button>
      {sound.alert ? (
        <button onClick={handleRemoveFromKit}>
          <FontAwesomeIcon className="remove-icon" icon={faXmark} size="2xs" />
        </button>
      ) : (
        <button onClick={handleAddToKit}>
          <FontAwesomeIcon className="add-icon" icon={faPlus} size="2xs" />
        </button>
      )}
    </article>
  );
}

export default SoundDetails;
