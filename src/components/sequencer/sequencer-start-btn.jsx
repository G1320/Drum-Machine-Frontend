import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../assets/styles/components/sequencer/sequencer-start-btn.scss';
import * as Tone from 'tone';
import { Button } from '@mui/material';
import { setIsPlaying } from '../../slices/transportSlice';
import { getSilence } from '../../services/sound-service';

const sequencerStartBtn = () => {
  const dispatch = useDispatch();
  const isPlaying = useSelector((state) => state.transport.isPlaying);
  const audioRef = useRef(null);
  const silenceAudioRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code !== 'Space') return;
      e.preventDefault();
      handleStartClick();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleStartClick = async () => {
    if (Tone.Transport.state === 'started') {
      Tone.Transport.pause();
      dispatch(setIsPlaying(false));
    } else {
      await playSilence();
      await Tone.start();
      Tone.Transport.start();
      dispatch(setIsPlaying(true));
    }
  };

  const playSilence = async () => {
    if (!silenceAudioRef.current) {
      const silence = await getSilence();
      silenceAudioRef.current = new Audio(silence.src);
    }
    audioRef.current = silenceAudioRef.current;
    audioRef.current.play();
  };

  return (
    <Button onClick={handleStartClick} className="sequencer-start-btn">
      {isPlaying ? 'Pause' : 'Play'}
    </Button>
  );
};

export default sequencerStartBtn;
