import React, { useState } from 'react';
import drumPadsConfig from '../config/drum-machineConfig';
import SequencerTrack from './sequencer-track';

function Sequencer() {
  const defaultEnvelope = { attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.1 };
  const defaultEffects = { delay: 0.2, reverb: 0.5 };

  const [trackStates, setTrackStates] = useState(
    drumPadsConfig.map((pad) => ({
      soundName: pad.text,
      soundURL: pad.src,
      envelope: defaultEnvelope,
      effects: defaultEffects,
    }))
  );

  return (
    <div>
      {trackStates.map((track, index) => (
        <SequencerTrack
          key={track.soundName}
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
