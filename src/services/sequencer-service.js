export const getLocalSequencerState = () => {
  const pattern = JSON.parse(localStorage.getItem('pattern')) || [];
  const mutedTracks = JSON.parse(localStorage.getItem('mutedTracks')) || [];
  const tempo = JSON.parse(localStorage.getItem('tempo')) || 16;
  const volume = JSON.parse(localStorage.getItem('volume')) || 0.5;
  const numOfSteps = JSON.parse(localStorage.getItem('numOfSteps')) || 32;
  return { pattern, mutedTracks, tempo, volume, numOfSteps };
};

export const setLocalSequencerState = (sequencerState) => {
  localStorage.setItem('pattern', JSON.stringify(sequencerState.pattern));
  localStorage.setItem('mutedTracks', JSON.stringify(sequencerState.mutedTracks));
  localStorage.setItem('tempo', JSON.stringify(sequencerState.tempo));
  localStorage.setItem('volume', JSON.stringify(sequencerState.volume));
  localStorage.setItem('numOfSteps', JSON.stringify(sequencerState.numOfSteps));
  console.log('sequencerState.numOfSteps: ', sequencerState.numOfSteps);
};

export const clearLocalSequencerState = () => {
  localStorage.setItem('pattern', JSON.stringify([]));
  localStorage.setItem('mutedTracks', JSON.stringify([]));
  localStorage.setItem('tempo', JSON.stringify(120));
  localStorage.setItem('volume', JSON.stringify(0.5));
  localStorage.setItem('numOfSteps', JSON.stringify(16));
};

export const setLocalPattern = (pattern) => {
  localStorage.setItem('pattern', JSON.stringify(pattern));
};

export const getLocalPattern = () => {
  const pattern = localStorage.getItem('pattern');

  if (pattern) return JSON.parse(pattern);

  return [];
};

export const setLocalMutedTracks = (mutedTracks) => {
  localStorage.setItem('mutedTracks', JSON.stringify(mutedTracks));
};

export const getLocalMutedTracks = () => {
  const mutedTracks = localStorage.getItem('mutedTracks');

  if (mutedTracks) return JSON.parse(mutedTracks);

  return [];
};

export const setLocalTempo = (tempo) => {
  localStorage.setItem('tempo', JSON.stringify(tempo));
};

export const getLocalTempo = () => {
  const tempo = localStorage.getItem('tempo');

  if (tempo) return JSON.parse(tempo);

  return 120;
};

export const setLocalVolume = (volume) => {
  localStorage.setItem('volume', JSON.stringify(volume));
};

export const getLocalVolume = () => {
  const volume = localStorage.getItem('volume');

  if (volume) return JSON.parse(volume);

  return 0.5;
};

export const setLocalNumOfSteps = (numOfSteps) => {
  localStorage.setItem('numOfSteps', JSON.stringify(numOfSteps));
  console.log('numOfSteps: ', numOfSteps);
};

export const getLocalNumOfSteps = () => {
  const numOfSteps = localStorage.getItem('numOfSteps');

  if (numOfSteps) return JSON.parse(numOfSteps);

  return 32;
};
