import React from 'react';
import '../../assets/styles/components/sounds/sound-details.scss';
import { playAudio } from '../../services/sound-service';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { faVolumeHigh, faXmark, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { setError } from '../../slices/errorSlice';
import {
  addSoundToKit as addSoundToKitService,
  removeSoundFromKit as removeSoundFromKitService,
} from '../../services/sound-service';
import {
  addSoundToKit as addSoundToKitSlice,
  removeSoundFromKit as removeSoundFromKitSlice,
} from '../../slices/soundsSlice';

import { useSounds } from '../../hooks/useSounds';
function SoundDetails({ sound, audioRef, className }) {
  const { kitId } = useParams();
  const dispatch = useDispatch();

  const { refetch: refetchSounds } = useSounds(kitId);

  const handleClick = () => {
    playAudio(audioRef);
  };

  const handleKitAction = async () => {
    try {
      if (sound.alert) {
        await removeSoundFromKitService(kitId, sound._id);
        dispatch(removeSoundFromKitSlice(sound));
      } else {
        await addSoundToKitService(kitId, sound._id);
        dispatch(addSoundToKitSlice(sound));
      }

      refetchSounds();
    } catch (error) {
      console.error('Failed to perform sound action', error);
      dispatch(setError(error?.response?.data || 'Failed to perform sound action'));
    }
  };

  return (
    <article className={className + ' sound-details'} key={sound.keyCode}>
      <p className="sound-title">{sound.title}</p>
      <audio src={sound.src} ref={audioRef} />
      <button onClick={handleClick}>
        <FontAwesomeIcon className="preview-icon" icon={faVolumeHigh} size="2xs" />
      </button>
      <button onClick={handleKitAction}>
        <FontAwesomeIcon
          className={sound.alert ? 'remove-icon' : 'add-icon'}
          icon={sound.alert ? faXmark : faPlus}
          size="2xs"
        />
      </button>
    </article>
  );
}

export default SoundDetails;
