const { createSlice } = require("@reduxjs/toolkit");

const todoSlice = createSlice({
  name: "todo",
  initialState: [],
  reducers: {
    addPost(state, action) {
      state.push(action.payload);
    },
    removePost(state, action) {
      return state;
    },
  },
});
const { actions, reducer } = todoSlice;
export const { addPost, removePost } = actions;
export default reducer;
