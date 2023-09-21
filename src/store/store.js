import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../reducers/index';
import errorReducer from '../slices/errorSlice';
import successReducer from '../slices/successSlice';
import authReducer from '../slices/authSlice';
import kitsReducer from '../slices/kitSlice';

const store = configureStore({
  reducer: {
    counter: counterReducer,
    error: errorReducer,
    success: successReducer,
    auth: authReducer,
    kits: kitsReducer,
  },
});

export default store;
