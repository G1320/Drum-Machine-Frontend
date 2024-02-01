export const clearLocalSequencerState = () => {
  localStorage.setItem('pattern', JSON.stringify([]));
  localStorage.setItem('mutedTracks', JSON.stringify([]));
  localStorage.setItem('tempo', JSON.stringify(120));
  localStorage.setItem('volume', JSON.stringify(0.5));
  localStorage.setItem('numOfSteps', JSON.stringify(32));
};

export const getLocalSequencerState = () => {
  const pattern = JSON.parse(localStorage.getItem('pattern'));
  const mutedTracks = JSON.parse(localStorage.getItem('mutedTracks'));
  const tempo = JSON.parse(localStorage.getItem('tempo'));
  const volume = JSON.parse(localStorage.getItem('volume'));
  const numOfSteps = JSON.parse(localStorage.getItem('numOfSteps'));
  return { pattern, mutedTracks, tempo, volume, numOfSteps };
};

export const localSaveSequencerState = (sequencerState) => {
  localStorage.setItem('pattern', JSON.stringify(sequencerState.pattern));
  localStorage.setItem('mutedTracks', JSON.stringify(sequencerState.mutedTracks));
  localStorage.setItem('tempo', JSON.stringify(sequencerState.tempo));
  localStorage.setItem('volume', JSON.stringify(sequencerState.volume));
  localStorage.setItem('numOfSteps', JSON.stringify(sequencerState.numOfSteps));
};

export const localSavePattern = (pattern) => {
  localStorage.setItem('pattern', JSON.stringify(pattern));
};

export const getLocalPattern = () => {
  const pattern = localStorage.getItem('pattern');

  if (pattern) return JSON.parse(pattern);

  return [];
};

export const localSaveMutedTracks = (mutedTracks) => {
  localStorage.setItem('mutedTracks', JSON.stringify(mutedTracks));
};

export const getLocalMutedTracks = () => {
  const mutedTracks = localStorage.getItem('mutedTracks');

  if (mutedTracks) return JSON.parse(mutedTracks);

  return [];
};

export const localSaveTempo = (tempo) => {
  localStorage.setItem('tempo', JSON.stringify(tempo));
};

export const getLocalTempo = () => {
  const tempo = localStorage.getItem('tempo');

  if (tempo) return JSON.parse(tempo);

  return 120;
};

export const localSaveVolume = (volume) => {
  localStorage.setItem('volume', JSON.stringify(volume));
};

export const getLocalVolume = () => {
  const volume = localStorage.getItem('volume');

  if (volume) return JSON.parse(volume);

  return 0.5;
};

export const localSaveNumOfSteps = (numOfSteps) => {
  localStorage.setItem('numOfSteps', JSON.stringify(numOfSteps));
};

export const getLocalNumOfSteps = () => {
  const numOfSteps = localStorage.getItem('numOfSteps');

  if (numOfSteps) return JSON.parse(numOfSteps);

  return 32;
};
