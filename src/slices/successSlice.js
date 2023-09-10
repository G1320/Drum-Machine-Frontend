import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  success: null,
};

const successSlice = createSlice({
  name: 'success',
  initialState,
  reducers: {
    setSuccess: (state, action) => {
      state.success = action.payload;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
  },
});

export const { setSuccess, clearSuccess } = successSlice.actions;
export default successSlice.reducer;
