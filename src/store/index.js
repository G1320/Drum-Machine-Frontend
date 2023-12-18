import { configureStore } from '@reduxjs/toolkit';
import errorReducer from '../slices/errorSlice';
import successReducer from '../slices/successSlice';
import authReducer from '../slices/authSlice';
import kitsReducer from '../slices/kitsSlice';
import soundsReducer from '../slices/soundsSlice';

const store = configureStore({
  reducer: {
    error: errorReducer,
    success: successReducer,
    auth: authReducer,
    kits: kitsReducer,
    sounds: soundsReducer,
  },
});

export default store;
