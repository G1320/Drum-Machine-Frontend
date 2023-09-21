import { createSlice } from '@reduxjs/toolkit';

const kitsSlice = createSlice({
  name: 'kits',
  initialState: {
    kits: [],
  },
  reducers: {
    setKits(state, action) {
      state.kits = action.payload;
    },
    addKit(state, action) {
      state.kits.push(action.payload);
    },
  },
});

export const { setKits, addKit } = kitsSlice.actions;
export default kitsSlice.reducer;
