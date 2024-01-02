// slices/selectedCellsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedCells: [],
};

export const selectedCellsSlice = createSlice({
  name: 'selectedCells',
  initialState,
  reducers: {
    setSelectedCells: (state, action) => {
      state.selectedCells = action.payload;
    },
    toggleSelectedCell: (state, action) => {
      const cellId = action.payload;
      if (state.selectedCells.includes(cellId)) {
        state.selectedCells = state.selectedCells.filter((id) => id !== cellId);
      } else {
        state.selectedCells.push(cellId);
      }
    },
    clearSelectedCells: (state) => {
      state.selectedCells = [];
    },
  },
});

export const { setSelectedCells, toggleSelectedCell, clearSelectedCells } = selectedCellsSlice.actions;

export default selectedCellsSlice.reducer;
