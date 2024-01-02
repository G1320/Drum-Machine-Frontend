import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isPlaying: false,
};

const transportSlice = createSlice({
  name: 'transport',
  initialState,
  reducers: {
    setIsPlaying(state, action) {
      state.isPlaying = action.payload;
      //   console.log('state.isPlaying: ', state.isPlaying);
    },
  },
});

export const { setIsPlaying } = transportSlice.actions;
export default transportSlice.reducer;
