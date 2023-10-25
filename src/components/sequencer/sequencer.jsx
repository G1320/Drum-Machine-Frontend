import React, { useState, useRef } from 'react';
import drumPadsConfig from '../../config/drumMachineDefaultConfig';
import SequencerTrack from './sequencer-track';
import '../../assets/styles/components/sequencer/sequencer.css';

function Sequencer() {
  const audioRefs = drumPadsConfig.map(() => useRef(null));

  const defaultEnvelope = { attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.1 };
  const defaultEffects = { delay: 0.2, reverb: 0.5 };

  const [trackStates, setTrackStates] = useState(
    audioRefs.map((pad) => ({
      soundName: pad.text,
      soundURL: pad.src,
      envelope: defaultEnvelope,
      effects: defaultEffects,
    }))
  );

  return (
    <div className="sequencer">
      {trackStates.map((track, index) => (
        <SequencerTrack
          className="sequencer-track"
          key={index}
          track={track}
          setTrackState={(newState) => {
            const updatedTracks = [...trackStates];
            updatedTracks[index] = newState;
            setTrackStates(updatedTracks);
          }}
        />
      ))}
    </div>
  );
}

export default Sequencer;
