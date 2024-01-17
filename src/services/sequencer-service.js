export const localSaveSelectedCells = (selectedCells) => {
  sessionStorage.setItem('selectedCells', JSON.stringify(selectedCells));
};

export const getLocalSelectedCells = () => {
  const selectedCells = sessionStorage.getItem('selectedCells');

  if (selectedCells) return JSON.parse(selectedCells);

  return [];
};

export const localSaveMutedTracks = (mutedTracks) => {
  sessionStorage.setItem('mutedTracks', JSON.stringify(mutedTracks));
};

export const getLocalMutedTracks = () => {
  const mutedTracks = sessionStorage.getItem('mutedTracks');

  if (mutedTracks) return JSON.parse(mutedTracks);

  return [];
};

export const localSaveNumOfSteps = (numOfSteps) => {
  sessionStorage.setItem('numOfSteps', JSON.stringify(numOfSteps));
};

export const getLocalNumOfSteps = () => {
  const numOfSteps = sessionStorage.getItem('numOfSteps');

  if (numOfSteps) return JSON.parse(numOfSteps);

  return 16;
};
