import { useState } from 'react';
import '../../assets/styles/components/sequencer/sequencer-start-btn.scss';
import * as Tone from 'tone';
import { Button } from '@mui/material';

const sequencerStartBtn = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStartClick = async () => {
    if (Tone.Transport.state === 'started') {
      Tone.Transport.pause();
      setIsPlaying(false);
    } else {
      await Tone.start();
      Tone.Transport.start();
      setIsPlaying(true);
    }
  };
  return (
    <Button onClick={handleStartClick} className="sequencer-start-btn">
      {isPlaying ? 'Pause' : 'Start'}
    </Button>
  );
};

export default sequencerStartBtn;
