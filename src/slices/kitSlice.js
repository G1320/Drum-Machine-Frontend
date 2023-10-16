import { createSlice } from '@reduxjs/toolkit';

const userKitsSlice = createSlice({
  name: 'userKits',
  initialState: {
    userKits: [],
  },
  reducers: {
    setUserKits(state, action) {
      state.userKits = action.payload;
    },
    addUserKit(state, action) {
      state.userKits.push(action.payload);
    },
  },
});

export const { setKits, addKit } = userKitsSlice.actions;
export default userKitsSlice.reducer;
