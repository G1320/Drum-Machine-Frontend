import { createSlice } from '@reduxjs/toolkit';

const userKitsSlice = createSlice({
  name: 'userKits',
  initialState: {
    userKits: [],
    selectedKitId: null,
    selectedKit: null,
  },
  reducers: {
    setSelectedKitId(state, action) {
      state.selectedKitId = action.payload;
    },
    setSelectedKit(state, action) {
      state.selectedKit = action.payload;
    },
    setUserKits(state, action) {
      state.userKits = action.payload;
    },
    addUserKit(state, action) {
      state.userKits.push(action.payload);
    },
    removeUserKit(state, action) {
      state.userKits = state.userKits.filter((kit) => kit._id !== action.payload);
    },
  },
});

export const { setKits, setSelectedKit, setSelectedKitId, addKit, removeUserKit } =
  userKitsSlice.actions;
export default userKitsSlice.reducer;
