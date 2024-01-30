import { createSlice } from '@reduxjs/toolkit';
import {
  getLocalMutedTracks,
  getLocalSelectedCells,
  getLocalTempo,
  getLocalVolume,
  getLocalNumOfSteps,
} from '../services/sequencer-service';

const initialState = {
  selectedCells: getLocalSelectedCells(),
  tempo: getLocalTempo(),
  volume: getLocalVolume(),
  mutedTracks: getLocalMutedTracks(),
  numOfSteps: getLocalNumOfSteps(),
};

export const sequencerSlice = createSlice({
  name: 'sequencer',
  initialState,
  reducers: {
    setSelectedCells: (state, action) => {
      state.selectedCells = action.payload;
    },
    clearSelectedCells: (state) => {
      state.selectedCells = [];
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
    setNumOfSteps: (state, action) => {
      state.numOfSteps = action.payload;
    },
    clearNumOfSteps: (state) => {
      state.numOfSteps = 32;
    },
    clearSequencerState: () => {
      clearSelectedCells();
      clearMutedTracks();
      clearTempo();
      clearVolume();
      clearNumOfSteps();
    },
  },
});

export const {
  setSelectedCells,
  clearSelectedCells,
  setTempo,
  clearTempo,
  setVolume,
  clearVolume,
  setMutedTracks,
  clearMutedTracks,
  setNumOfSteps,
  clearNumOfSteps,
  clearSequencerState,
} = sequencerSlice.actions;

export default sequencerSlice.reducer;
