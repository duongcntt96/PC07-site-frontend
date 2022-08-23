import { configureStore } from "@reduxjs/toolkit";

import todoReducer from "./todoSlice";
import subMenuReducer from "components/SubMenu/subMenuSlice";
import modalReducer from "components/Modal/modalSlice";
import userSlice from "components/User/userSlice";
const store = configureStore({
  reducer: {
    todos: todoReducer,
    subMenu: subMenuReducer,
    modal: modalReducer,
    user: userSlice,
  },
});

export default store;
