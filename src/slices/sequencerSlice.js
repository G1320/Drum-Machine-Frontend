import { createSlice } from '@reduxjs/toolkit';
import { getLocalSequencerState } from '../services/sequencer-service';

const initialState = getLocalSequencerState();

export const sequencerSlice = createSlice({
  name: 'sequencer',
  initialState,
  reducers: {
    setPattern: (state, action) => {
      state.pattern = action.payload;
    },
    clearPattern: (state) => {
      state.pattern = [];
    },
    setMutedTracks: (state, action) => {
      state.mutedTracks = action.payload;
    },
    clearMutedTracks: (state) => {
      state.mutedTracks = [];
    },
    setTempo: (state, action) => {
      state.tempo = action.payload;
    },
    clearTempo: (state) => {
      state.tempo = 120;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
    },
    clearVolume: (state) => {
      state.volume = 0.5;
    },
    setReverb: (state, action) => {
      state.reverb = action.payload;
    },
    clearReverb: (state) => {
      state.reverb = 0;
    },
    setSwing: (state, action) => {
      state.swing = action.payload;
    },
    clearSwing: (state) => {
      state.swing = 0;
    },
    setStep: (state, action) => {
      state.step = action.payload;
    },
    clearStep: (state) => {
      state.step = 0;
    },
    setDelay: (state, action) => {
      state.delay = action.payload;
    },
    clearDelay: (state) => {
      state.delay = 0;
    },
    setNumOfSteps: (state, action) => {
      state.numOfSteps = action.payload;
    },
    clearNumOfSteps: (state) => {
      state.numOfSteps = 16;
    },
    setSongId: (state, action) => {
      state.songId = action.payload;
    },
    clearSongId: (state) => {
      state.songId = null;
    },
    setSequencerState: (state, action) => {
      return {
        pattern: action.payload.pattern,
        mutedTracks: action.payload.mutedTracks,
        tempo: action.payload.tempo,
        volume: action.payload.volume,
        numOfSteps: action.payload.numOfSteps,
        songId: action.payload.songId,
        reverb: action.payload.reverb,
        delay: action.payload.delay,
        swing: action.payload.swing,
        step: action.payload.step,
      };
    },
    clearSequencerState: () => {
      return {
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
      };
    },
  },
});

export const {
  setPattern,
  clearPattern,
  setTempo,
  clearTempo,
  setVolume,
  clearVolume,
  setReverb,
  clearReverb,
  setDelay,
  clearDelay,
  setSwing,
  clearSwing,
  setStep,
  clearStep,
  setMutedTracks,
  clearMutedTracks,
  setNumOfSteps,
  clearNumOfSteps,
  setSongId,
  clearSongId,
  setSequencerState,
  clearSequencerState,
} = sequencerSlice.actions;

export default sequencerSlice.reducer;
