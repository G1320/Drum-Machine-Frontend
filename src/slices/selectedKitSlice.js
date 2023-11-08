import { createSlice } from '@reduxjs/toolkit';

const selectedKitSlice = createSlice({
  name: 'selectedKit',
  initialState: null,
  reducers: {
    setSelectedKit(state, action) {
      // console.log('action.payload;: ', action.payload);
      return action.payload;
    },
  },
});

export const { setSelectedKit } = selectedKitSlice.actions;
export default selectedKitSlice.reducer;
