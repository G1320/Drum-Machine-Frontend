import { configureStore } from '@reduxjs/toolkit';
import errorReducer from '../slices/errorSlice';
import successReducer from '../slices/successSlice';
import authReducer from '../slices/authSlice';
import kitsReducer from '../slices/kitsSlice';
import soundsReducer from '../slices/soundsSlice';
import transportReducer from '../slices/transportSlice';
import sequencerReducer from '../slices/sequencerSlice';

const store = configureStore({
  reducer: {
    error: errorReducer,
    success: successReducer,
    auth: authReducer,
    kits: kitsReducer,
    sounds: soundsReducer,
    transport: transportReducer,
    sequencer: sequencerReducer,
  },
});

export default store;
