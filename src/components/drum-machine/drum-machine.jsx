import React, { useState, useEffect, useRef, createRef } from 'react';
import '../../assets/styles/components/drum-machine/drum-machine.scss';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setError } from '../../slices/errorSlice';
import drumMachineDefaultConfig from '../../config/drumMachineDefaultConfig';
import DrumPad from './drum-pad';
import SoundsList from '../sounds/sounds-list';
import UserKitsList from '../kits/user-kits-list';
import DrumMachineOptions from './drum-machine-options';
import { useSounds } from '../../hooks/useSounds';

const DrumMachine = () => {
  const { kitId } = useParams();
  const dispatch = useDispatch();

  const { data: selectedKitSounds } = useSounds(kitId);
  const [activePad, setActivePad] = useState(null);

  const audioRefs = useRef([]);

  useEffect(() => {
    try {
      if (kitId) {
        audioRefs.current = selectedKitSounds.map((_, index) => audioRefs.current[index] ?? createRef());
      }
    } catch (error) {
      console.error('Failed to load kit', error);
      dispatch(setError(error?.response?.data || 'Failed to load kit'));
    }
  }, [kitId]);

  const toggleActive = (keyCode) => {
    activePad === keyCode ? setActivePad(null) : setActivePad(keyCode);
  };

  const handleMouseUp = () => {
    setActivePad(null);
  };

  return (
    <section className="drum-machine">
      <section className="drum-machine-wrapper">
        <section className="drum-table">
          {selectedKitSounds.map((sound, index) => (
            <DrumPad
              key={sound._id}
              keyCode={drumMachineDefaultConfig[index].keyCode.toString()}
              sound={sound}
              isActive={activePad === drumMachineDefaultConfig[index].keyCode.toString()}
              toggleActive={toggleActive}
              onMouseUp={handleMouseUp}
              audioRef={audioRefs.current[index]}
            />
          ))}
        </section>
      </section>
      <DrumMachineOptions kitId={kitId} />
      <section className="main-content-bottom-wrapper">
        <UserKitsList />
        <SoundsList kitId={kitId} />
      </section>
    </section>
  );
};

export default DrumMachine;
