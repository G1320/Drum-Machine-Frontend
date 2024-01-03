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
      console.log('state.selectedCells: ', state.selectedCells);
      if (state.selectedCells.includes(cellId)) {
        return {
          ...state,
          selectedCells: state.selectedCells.filter((id) => id !== cellId),
        };
      } else {
        return {
          ...state,
          selectedCells: [...state.selectedCells, cellId],
        };
      }
    },
    clearSelectedCells: (state) => {
      state.selectedCells = [];
    },
  },
});

export const { setSelectedCells, toggleSelectedCell, clearSelectedCells } = selectedCellsSlice.actions;

export default selectedCellsSlice.reducer;
