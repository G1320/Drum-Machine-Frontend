import React from 'react';
import * as Tone from 'tone';
import Controls from './sequencer-controls';

function SequencerTrack({ track, setTrackState }) {
  const sampler = new Tone.Sampler({
    urls: {
      C4: track.soundURL,
    },
    envelope: track.envelope,
  }).toDestination();

  return (
    <div>
      <button onClick={() => sampler.triggerAttack('C4')}>{track.soundName}</button>
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
