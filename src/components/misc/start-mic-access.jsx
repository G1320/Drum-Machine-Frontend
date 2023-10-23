import React, { useState } from 'react';
import * as Tone from 'tone';

function StartMicrophoneAccess() {
  const [accessGranted, setAccessGranted] = useState(null);

  const requestMicrophoneAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted');
      setAccessGranted(true);
    } catch (error) {
      console.error('Microphone access denied:', error);
      setAccessGranted(false);
    }
  };

  const handleButtonClick = async () => {
    try {
      await Tone.start();
      console.log('Tone.js initialized');
    } catch (toneError) {
      console.error('Failed to initialize Tone.js:', toneError);
    }
  };

  return (
    <div>
      {accessGranted === false && (
        <div>
          <p>Microphone access denied.</p>
        </div>
      )}
      {accessGranted === true && (
        <div>
          <p>Microphone access granted.</p>
          <button onClick={handleButtonClick}>Initialize Tone.js</button>
        </div>
      )}
      {accessGranted === null && (
        <div>
          <p>Requesting microphone access...</p>
          <button onClick={requestMicrophoneAccess}>Request access</button>
        </div>
      )}
    </div>
  );
}

export default StartMicrophoneAccess;
