const { createSlice } = require("@reduxjs/toolkit");

const userSlice = createSlice({
  name: "user",
  initialState: { user: null },
  reducers: {
    login(state, action) {
      state.user = "duongcntt96";
    },
    logout(state) {
      state.user = "";
    },
  },
});

const { actions, reducer } = userSlice;
export const { login, logout } = actions;
export default reducer;
