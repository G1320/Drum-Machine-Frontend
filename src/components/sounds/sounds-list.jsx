import React, { useEffect, useState, useRef, createRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../../assets/styles/components/sounds/sounds-list.scss';

import SoundDetails from './sound-details';
import { getLocalUser } from '../../services/user-service';
import { setSelectedKit } from '../../slices/kitsSlice';

function SoundsList({ kitId }) {
  const dispatch = useDispatch();
  const [sounds, setSounds] = useState([]);
  const audioRefs = useRef([]);
  const user = getLocalUser();
  const selectedKit = useSelector((state) => state.kits.selectedKit);
  const kitSounds = useSelector((state) => state.sounds.selectedKitSounds);
  const allSounds = useSelector((state) => state.sounds.allSounds);
  const combinedKits = useSelector((state) => state.kits.combinedKits);

  useEffect(() => {
    setSounds(
      allSounds.map((sound) => {
        if (kitSounds.some((kitSound) => kitSound._id === sound._id)) {
          return { ...sound, alert: true };
        }
        return sound;
      })
    );

    audioRefs.current = sounds.map((_, index) => audioRefs.current[index] ?? createRef());
  }, [kitSounds, allSounds]);

  useEffect(() => {
    const getSelectedKit = () => {
      if (kitId && user?._id) {
        const selectedKit = combinedKits.find((kit) => kit._id === kitId);
        if (selectedKit) {
          dispatch(setSelectedKit(selectedKit));
        }
      }
    };
    getSelectedKit();
  }, [kitId, user?._id, dispatch, kitSounds]);

  return (
    <>
      {user && (user.isAdmin || selectedKit?.isCustom) ? (
        <>
          <section className={'sounds-list expanded'}>
            {' '}
            {sounds.map((sound, index) => (
              <SoundDetails
                key={sound._id}
                sound={sound}
                audioRef={audioRefs.current[index]}
                soundKey={index}
                className={`${sound.alert ? 'alert' : ''} expanded`}
              />
            ))}
          </section>
        </>
      ) : (
        <section className="sounds-list-placeholder">
          <p className=" placeholder">Select a custom kit to add or remove sounds.</p>
        </section>
      )}
    </>
  );
}

export default SoundsList;
