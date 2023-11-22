import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sounds: [],
};

const soundsSlice = createSlice({
  name: 'sounds',
  initialState,
  reducers: {
    setSounds: (state, action) => {
      return {
        ...state,
        sounds: action.payload,
      };
    },
  },
});

export const { setSounds } = soundsSlice.actions;

export default soundsSlice.reducer;
