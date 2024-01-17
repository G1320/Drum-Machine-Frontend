import { createSlice } from '@reduxjs/toolkit';
import { getLocalSelectedCells } from '../services/sequencer-service';

const initialState = {
    selectedCells: getLocalSelectedCells() || [],
};

export const selectedCellsSlice = createSlice({
  name: 'selectedCells',
  initialState,
  reducers: {
    setSelectedCells: (state, action) => {
      state.selectedCells = action.payload;
    },
    clearSelectedCells: (state) => {
    state.selectedCells = [];
   },
  },
});

export const { setSelectedCells, toggleSelectedCell, clearSelectedCells } = selectedCellsSlice.actions;

export default selectedCellsSlice.reducer;
