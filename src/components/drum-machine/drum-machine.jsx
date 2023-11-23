import React, { useState, useEffect, useRef, createRef } from 'react';
import '../../assets/styles/components/drum-machine/drum-machine.scss';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getKitSounds } from '../../services/kit-service';
import { setError } from '../../slices/errorSlice';
import drumMachineDefaultConfig from '../../config/drumMachineDefaultConfig';
import DrumPad from './drum-pad';
import SoundsList from '../sounds/sounds-list';
import UserInfo from '../user/user-info';
import { setSounds } from '../../slices/soundsSlice';
import DrumMachineOptions from './drum-machine-options';

const DrumMachine = () => {
  const { kitId } = useParams();
  const dispatch = useDispatch();

  const sounds = useSelector((state) => state.sounds.sounds);
  const [activePad, setActivePad] = useState(null);

  const audioRefs = useRef([]);

  useEffect(() => {
    const getSounds = async () => {
      try {
        if (kitId) {
          const kitSounds = await getKitSounds(kitId);
          dispatch(setSounds(kitSounds));
          audioRefs.current = sounds.map((_, index) => audioRefs.current[index] ?? createRef());
        }
      } catch (error) {
        console.error('Failed to load kit', error);
        dispatch(setError(error?.response?.data || 'Failed to load kit'));
      }
    };
    getSounds();
  }, [kitId, sounds]);

  const toggleActive = (keyCode) => {
    if (activePad === keyCode) {
      setActivePad(null);
    } else {
      setActivePad(keyCode);
    }
  };

  const handleMouseUp = () => {
    setActivePad(null);
  };

  return (
    <section className="drum-machine">
      <section className="drum-machine-wrapper">
        <UserInfo />
        <section className="drum-table">
          {sounds.map((sound, index) => (
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
      <section className="drum-machine-bottom-wrapper">
        <SoundsList kitId={kitId} />
      </section>
    </section>
  );
};

export default DrumMachine;
