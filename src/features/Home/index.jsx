import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import React from "react";
import { useDispatch } from "react-redux";

function Home(props) {
  const dispatch = useDispatch();
  return (
    <main onMouseOver={(e) => dispatch(closeSubMenu())}>
      <h1>Home Screen</h1>
    </main>
  );
}

export default Home;
