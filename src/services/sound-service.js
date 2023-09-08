export const playAudio = (audioRef) => {
  if (audioRef && audioRef.current) {
    try {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }
};
