import { parseJSON, stringifyJSON } from '../utils/storageUtils';

export const getLocalSequencerState = () => {
  const pattern = parseJSON('pattern', []);
  const mutedTracks = parseJSON('mutedTracks', []);
  const tempo = parseJSON('tempo', 120);
  const volume = parseJSON('volume', 0.5);
  const numOfSteps = parseJSON('numOfSteps', 16);
  const songId = parseJSON('songId', null);
  const reverb = parseJSON('reverb', 0);
  const delay = parseJSON('delay', 0);
  const swing = parseJSON('swing', 0);
  const step = parseJSON('step', 0);
  return { pattern, mutedTracks, tempo, volume, reverb, delay, swing, numOfSteps, songId, step };
};

export const setLocalSequencerState = (sequencerState) => {
  stringifyJSON('pattern', sequencerState.pattern || []);
  stringifyJSON('mutedTracks', sequencerState.mutedTracks || []);
  stringifyJSON('tempo', sequencerState.tempo || 120);
  stringifyJSON('volume', sequencerState.volume || 0.5);
  stringifyJSON('numOfSteps', sequencerState.numOfSteps || 16);
  stringifyJSON('songId', sequencerState._id || null);
  stringifyJSON('reverb', sequencerState.reverb || 0);
  stringifyJSON('delay', sequencerState.delay || 0);
  stringifyJSON('swing', sequencerState.swing || 0);
  stringifyJSON('step', sequencerState.step || 0);
};

export const clearLocalSequencerState = () => {
  setLocalSequencerState({
    pattern: [],
    mutedTracks: [],
    tempo: 120,
    volume: 0.5,
    numOfSteps: 16,
    songId: null,
    reverb: 0,
    delay: 0,
    swing: 0,
    step: 0,
  });
};

export const getLocalPattern = () => parseJSON('pattern', []);

export const setLocalPattern = (pattern) => stringifyJSON('pattern', pattern);

export const getLocalMutedTracks = () => parseJSON('mutedTracks', []);

export const setLocalMutedTracks = (mutedTracks) => stringifyJSON('mutedTracks', mutedTracks);

export const getLocalTempo = () => parseJSON('tempo', 120);

export const setLocalTempo = (tempo) => stringifyJSON('tempo', tempo);

export const getLocalVolume = () => parseJSON('volume', 0.5);

export const setLocalVolume = (volume) => stringifyJSON('volume', volume);

export const getLocalNumOfSteps = () => parseJSON('numOfSteps', 32);

export const setLocalNumOfSteps = (numOfSteps) => stringifyJSON('numOfSteps', numOfSteps);

export const getLocalSongId = () => parseJSON('songId', null);

export const setLocalSongId = (songId) => stringifyJSON('songId', songId);

export const getLocalNumOfStepsPrePortrait = () => parseJSON('numOfStepsPrePortrait', 32);

export const setLocalNumOfStepsPrePortrait = (numOfSteps) =>
  stringifyJSON('numOfStepsPrePortrait', numOfSteps);

export const getLocalReverb = () => parseJSON('reverb', 0);

export const setLocalReverb = (reverb) => stringifyJSON('reverb', reverb);

export const getLocalDelay = () => parseJSON('delay', 0);

export const setLocalDelay = (delay) => stringifyJSON('delay', delay);

export const getLocalSwing = () => parseJSON('swing', 0);

export const setLocalSwing = (swing) => stringifyJSON('swing', swing);

export const getLocalStep = () => parseJSON('step', 0);

export const setLocalStep = (step) => stringifyJSON('step', step);
