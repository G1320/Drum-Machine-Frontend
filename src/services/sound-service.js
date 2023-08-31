export const playAudio = (audioRef) => {
  if (audioRef && audioRef.current) {
    audioRef.current.currentTime = 0; // Reset audio to start if it's clicked again before finishing
    audioRef.current.play();
  }
};

// Add more audio related functions if necessary in the future.
