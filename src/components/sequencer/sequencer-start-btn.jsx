import { useDispatch, useSelector } from 'react-redux';
import '../../assets/styles/components/sequencer/sequencer-start-btn.scss';
import * as Tone from 'tone';
import { Button } from '@mui/material';
import { setIsPlaying } from '../../slices/transportSlice';

const sequencerStartBtn = () => {
  const dispatch = useDispatch();
  const isPlaying = useSelector((state) => state.transport.isPlaying);

  const handleStartClick = async () => {
    if (Tone.Transport.state === 'started') {
      Tone.Transport.pause();
      dispatch(setIsPlaying(false));
    } else {
      await Tone.start();
      Tone.Transport.start();
      dispatch(setIsPlaying(true));
    }
  };
  return (
    <Button onClick={handleStartClick} className="sequencer-start-btn">
      {isPlaying ? 'Pause' : 'Start'}
    </Button>
  );
};

export default sequencerStartBtn;
