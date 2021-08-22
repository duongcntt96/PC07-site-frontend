import { configureStore } from "@reduxjs/toolkit";

import todoReducer from "./todoSlice";
import subMenuReducer from "components/SubMenu/subMenuSlice";
const store = configureStore({
  reducer: {
    todos: todoReducer,
    subMenu: subMenuReducer,
  },
});

export default store;
