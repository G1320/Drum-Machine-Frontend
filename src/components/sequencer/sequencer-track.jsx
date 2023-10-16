import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';
import Controls from './sequencer-controls';
import '../../assets/styles/components/sequencer/sequencer-track.css';

function SequencerTrack({ track, setTrackState }) {
  const [sampler, setSampler] = useState(null);

  useEffect(() => {
    setSampler(
      new Tone.Sampler({
        urls: {
          C4: track.soundURL,
        },
        envelope: track.envelope,
      }).toDestination()
    );
  }, [track]);

  return (
    <div className="sequencer-track">
      {/* <button onClick={() => sampler.triggerAttack('C4')}>{track.soundName}</button> */}
      <Controls
        envelope={track.envelope}
        setEnvelope={(newEnvelope) => setTrackState({ ...track, envelope: newEnvelope })}
        effects={track.effects}
        setEffects={(newEffects) => setTrackState({ ...track, effects: newEffects })}
      />
    </div>
  );
}

export default SequencerTrack;
