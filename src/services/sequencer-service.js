export const clearSequencerStorage = () => {
  localStorage.setItem('selectedCells', JSON.stringify([]));
  localStorage.setItem('mutedTracks', JSON.stringify([]));
  localStorage.setItem('tempo', JSON.stringify(120));
  localStorage.setItem('volume', JSON.stringify(0.5));
  localStorage.setItem('numOfSteps', JSON.stringify(32));
};

export const localSaveSelectedCells = (selectedCells) => {
  localStorage.setItem('selectedCells', JSON.stringify(selectedCells));
};

export const getLocalSelectedCells = () => {
  const selectedCells = localStorage.getItem('selectedCells');

  if (selectedCells) return JSON.parse(selectedCells);

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
