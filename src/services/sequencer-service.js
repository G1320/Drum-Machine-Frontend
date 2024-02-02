import { parseJSON, stringifyJSON } from '../utils/storageUtils';

export const getLocalSequencerState = () => {
  const pattern = parseJSON('pattern', []);
  const mutedTracks = parseJSON('mutedTracks', []);
  const tempo = parseJSON('tempo', 16);
  const volume = parseJSON('volume', 0.5);
  const numOfSteps = parseJSON('numOfSteps', 32);
  return { pattern, mutedTracks, tempo, volume, numOfSteps };
};

export const setLocalSequencerState = (sequencerState) => {
  stringifyJSON('pattern', sequencerState.pattern);
  stringifyJSON('mutedTracks', sequencerState.mutedTracks);
  stringifyJSON('tempo', sequencerState.tempo);
  stringifyJSON('volume', sequencerState.volume);
  stringifyJSON('numOfSteps', sequencerState.numOfSteps);
};

export const clearLocalSequencerState = () => {
  setLocalSequencerState({
    pattern: [],
    mutedTracks: [],
    tempo: 120,
    volume: 0.5,
    numOfSteps: 16,
  });
};

export const setLocalPattern = (pattern) => {
  stringifyJSON('pattern', pattern);
};

export const getLocalPattern = () => {
  return parseJSON('pattern', []);
};

export const setLocalMutedTracks = (mutedTracks) => {
  stringifyJSON('mutedTracks', mutedTracks);
};

export const getLocalMutedTracks = () => {
  return parseJSON('mutedTracks', []);
};

export const setLocalTempo = (tempo) => {
  stringifyJSON('tempo', tempo);
};

export const getLocalTempo = () => {
  return parseJSON('tempo', 120);
};

export const setLocalVolume = (volume) => {
  stringifyJSON('volume', volume);
};

export const getLocalVolume = () => {
  return parseJSON('volume', 0.5);
};

export const setLocalNumOfSteps = (numOfSteps) => {
  stringifyJSON('numOfSteps', numOfSteps);
};

export const getLocalNumOfSteps = () => {
  return parseJSON('numOfSteps', 32);
};
