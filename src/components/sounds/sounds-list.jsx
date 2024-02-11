import React, { useEffect, useState, useRef, createRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../../assets/styles/components/sounds/sounds-list.scss';

import SoundDetails from './sound-details';

import AudioVisualizer from '../visualizer/audio-visualizer';
import { getLocalUser } from '../../services/user-service';
import { setSelectedKit } from '../../slices/kitsSlice';

function SoundsList({ kitId, selectedKitSounds }) {
  const dispatch = useDispatch();
  const [sounds, setSounds] = useState([]);
  const audioRefs = useRef([]);
  const user = getLocalUser();

  const selectedKit = useSelector((state) => state.kits.selectedKit);
  const combinedKits = useSelector((state) => state.kits.combinedKits);
  const allSounds = useSelector((state) => state.sounds.allSounds);

  useEffect(() => {
    // prettier-ignore
    //Adding alert property to sounds that are also present in the current selected kit
    setSounds(allSounds.map((sound) => {
        if (selectedKitSounds?.some((kitSound) => kitSound._id === sound._id)) {
          return { ...sound, alert: true };
        }
        return sound;
      })
    );
    // creating an audioRef for each sound
    audioRefs.current = sounds.map((_, index) => audioRefs.current[index] ?? createRef());
  }, [selectedKitSounds]);

  useEffect(() => {
    // finding and setting the selectedKit via kitId
    const getSelectedKit = () => {
      if (kitId && combinedKits.length > 0) {
        const selectedKit = combinedKits.find((kit) => kit._id === kitId);
        if (selectedKit) dispatch(setSelectedKit(selectedKit));
      }
    };
    getSelectedKit();
  }, [kitId, dispatch]);

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
        <AudioVisualizer />
      )}
    </>
  );
}

export default SoundsList;
