import React, { useState } from 'react';
import * as Tone from 'tone';
import SynthKeys from './synthKeys';
import StartAudioContext from './StartAudioContext';

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
      <StartAudioContext />
      <SynthKeys playNote={playNote} stopNote={stopNote} />
    </div>
  );
};

export default Synth;
