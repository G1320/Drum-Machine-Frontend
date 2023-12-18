import { createSlice } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { getSounds } from '../services/sound-service';

const initialState = {
  allSounds: [],
  selectedKitSounds: [],
};

const soundsSlice = createSlice({
  name: 'selectedKitSounds',
  initialState,
  reducers: {
    setAllSounds: (state, action) => {
      state.allSounds = action.payload;
    },
    setSelectedKitSounds: (state, action) => {
      state.selectedKitSounds = action.payload;
    },
    addSoundToKit: (state, action) => {
      state.selectedKitSounds.push(action.payload);
    },
    removeSoundFromKit: (state, action) => {
      state.selectedKitSounds = state.selectedKitSounds.filter(
        (sound) => sound._id !== action.payload._id
      );
    },
  },
});

export const { setAllSounds, setSelectedKitSounds, addSoundToKit, removeSoundFromKit } =
  soundsSlice.actions;

export default soundsSlice.reducer;
