const { createSlice } = require("@reduxjs/toolkit");

const modalSlice = createSlice({
  name: "modal",
  initialState: { isShowing: false, data: {} },
  reducers: {
    showModal(state, action) {
      state.isShowing = true;
      state.data = action.payload;
    },
    closeModal(state) {
      state.isShowing = false;
    },
  },
});

const { actions, reducer } = modalSlice;
export const { showModal, closeModal } = actions;
export default reducer;
