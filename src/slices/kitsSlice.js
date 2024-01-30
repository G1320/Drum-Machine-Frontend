import { createSlice } from '@reduxjs/toolkit';

const userKitsSlice = createSlice({
  name: 'userKits',
  initialState: {
    userKits: [],
    selectedKitId: null,
    selectedKit: null,
    allKits: [],
    combinedKits: [],
  },
  reducers: {
    setAllKits(state, action) {
      state.allKits = action.payload;
    },
    setSelectedKit(state, action) {
      state.selectedKit = action.payload;
    },
    setSelectedKitId(state, action) {
      state.selectedKitId = action.payload;
    },
    setUserKits(state, action) {
      state.userKits = action.payload;
    },
    setCombinedKits(state, action) {
      state.combinedKits = action.payload;
    },
    removeFromCombinedKits(state, action) {
      state.combinedKits = state.combinedKits.filter((kit) => kit._id !== action.payload);
    },
    addUserKit(state, action) {
      state.userKits.push(action.payload);
    },
    removeUserKit(state, action) {
      state.userKits = state.userKits.filter((kit) => kit._id !== action.payload);
    },
  },
});

export const {
  setAllKits,
  setSelectedKit,
  setUserKits,
  setSelectedKitId,
  setCombinedKits,
  removeFromCombinedKits,
  addKit,
  removeUserKit,
} = userKitsSlice.actions;
export default userKitsSlice.reducer;
