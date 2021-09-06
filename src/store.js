import { configureStore } from "@reduxjs/toolkit";

import todoReducer from "./todoSlice";
import subMenuReducer from "components/SubMenu/subMenuSlice";
import modalReducer from "components/Modal/modalSlice";
const store = configureStore({
  reducer: {
    todos: todoReducer,
    subMenu: subMenuReducer,
    modal: modalReducer,
  },
});

export default store;
