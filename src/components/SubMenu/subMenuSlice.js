const { createSlice } = require("@reduxjs/toolkit");

const subMenuSlice = createSlice({
  name: "subMenuSlice",
  initialState: {
    isShowing: false,
    position: {},
    data: [],
  },
  reducers: {
    openSubMenu(state, action) {
      return {
        isShowing: true,
        data: action.payload.data,
        position: action.payload.position,
      };
    },
    closeSubMenu(state) {
      state.isShowing = false;
    },
  },
});

const { actions, reducer } = subMenuSlice;
export const { openSubMenu, closeSubMenu } = actions;
export default reducer;
