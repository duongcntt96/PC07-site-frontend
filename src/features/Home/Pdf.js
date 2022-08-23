import ImageSlide from "components/ImageSlide";
import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import React from "react";
import { useDispatch } from "react-redux";

import "video-react/dist/video-react.css"; // import css
import { Player } from "video-react";
function Home() {
  const dispatch = useDispatch();
  return (
    <main onMouseOver={(e) => dispatch(closeSubMenu())}>
      <h1>Home</h1>
      <ImageSlide images={null} />
      <Player
        playsInline
        poster="http://localhost:8000/static/images/upload/default.jpg"
        src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
      />
    </main>
  );
}

export default Home;
