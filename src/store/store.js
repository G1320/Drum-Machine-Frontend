import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../reducers/index';
import errorReducer from '../slices/errorSlice';
import successReducer from '../slices/successSlice';

const store = configureStore({
  reducer: {
    counter: counterReducer,
    error: errorReducer,
    success: successReducer,
  },
});

export default store;
