import { createSlice } from '@reduxjs/toolkit';

const userKitsSlice = createSlice({
  name: 'userKits',
  initialState: {
    userKits: [],
    selectedKit: null,
  },
  reducers: {
    setUserKits(state, action) {
      state.userKits = action.payload;
      // console.log('state.userKits: ', state.userKits);
    },
    addUserKit(state, action) {
      state.userKits.push(action.payload);
    },
    removeUserKit(state, action) {
      state.userKits = state.userKits.filter((kit) => kit._id !== action.payload);
    },
  },
});

export const { setKits, addKit, removeUserKit } = userKitsSlice.actions;
export default userKitsSlice.reducer;
