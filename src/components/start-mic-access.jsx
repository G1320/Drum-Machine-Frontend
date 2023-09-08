import React, { useState } from 'react';
import * as Tone from 'tone';

function StartMicrophoneAccess() {
  const [accessGranted, setAccessGranted] = useState(null);

  const requestMicrophoneAccess = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('Microphone access granted');
      setAccessGranted(true);
      try {
        await Tone.start();
        console.log('Tone.js initialized');
      } catch (toneError) {
        console.error('Failed to initialize Tone.js:', toneError);
      }
    } catch (error) {
      console.error('Microphone access denied:', error);
      setAccessGranted(false);
    }
  };

  return (
    <div>
      <button onClick={requestMicrophoneAccess}>Request Microphone Access</button>
      {accessGranted === true && <p>Access granted</p>}
      {accessGranted === false && <p>Access denied</p>}
    </div>
  );
}

export default StartMicrophoneAccess;
