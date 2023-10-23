import React, { useState } from 'react';
import * as Tone from 'tone';
import SynthKeys from './synth-keys';
import '../../assets/styles/components/synth/synth.css';

const Synth = () => {
  const synth = new Tone.Synth({
    envelope: {
      attack: 0.1,
      decay: 0.1,
      sustain: 0.1,
      release: 0.1,
    },
  }).toDestination();

  const playNote = (note) => {
    synth.triggerAttack(note);
  };

  const stopNote = () => {
    synth.triggerRelease();
  };

  return (
    <div>
      <SynthKeys playNote={playNote} stopNote={stopNote} />
    </div>
  );
};

export default Synth;
