import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../reducers/index';
import errorReducer from '../slices/errorSlice'; // Adjust the path to your new slice file

const store = configureStore({
  reducer: {
    counter: counterReducer,
    error: errorReducer,
  },
});

export default store;
