import React, { useEffect } from 'react';
import * as Tone from 'tone';

const StartAudioContext = () => {
  const startAudio = async () => {
    // this will prompt the user to click to start the audio context
    await Tone.start();
    console.log('audio context started');
  };

  return <button onClick={startAudio}>Start Audio</button>;
};

export default StartAudioContext;
