import ImageSlide from "components/ImageSlide";
import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import React from "react";
import { useDispatch } from "react-redux";

import "video-react/dist/video-react.css"; // import css
import { Player } from "video-react";
function Home() {
  const dispatch = useDispatch();
  const rootURL =
    "https://zslcmpn6ktwqvtatvczr1g.on.drv.tw/%E1%BA%A2nh%20c%C6%B0%E1%BB%9Bi/D%C6%B0%C6%A1ng%20Trang/Ch%E1%BB%8Dn/H%C3%ACnh%20g%E1%BB%ADi%20s%E1%BB%ADa/";
  const imagesText = [
    "TAN_2668.JPG",
    "TAN_3442.JPG",
    "TAN_2913.JPG",
    "TAN_3593.JPG",
    "TAN_2235.JPG",
    "TAN_2923.JPG",
    "TAN_3068.JPG",
    "TAN_2913.JPG",
  ];
  const imagesTexts = [
    "TAN_3608.JPG",
    "TAN_3593.JPG",
    "TAN_3552.JPG",
    "TAN_3510.JPG",
    "TAN_3504.JPG",
    "TAN_3461.JPG",
    "TAN_3442.JPG",
    "TAN_3440.JPG",
    "TAN_3432.JPG",
    "TAN_3348.JPG",
    "TAN_3342.JPG",
    "TAN_3296.JPG",
    "TAN_3291.JPG",
    "TAN_3281.JPG",
    "TAN_3276.JPG",
    "TAN_3260.JPG",
    "TAN_3228.JPG",
    "TAN_3207.JPG",
    "TAN_3161.JPG",
    "TAN_3144.JPG",
    "TAN_3092.JPG",
    "TAN_3088.JPG",
    "TAN_3068.JPG",
    "TAN_2923.JPG",
    "TAN_2913.JPG",
    "TAN_2843.JPG",
    "TAN_2819.JPG",
    "TAN_2807.JPG",
    "TAN_2795.JPG",
    "TAN_2765.JPG",
    "TAN_2750.JPG",
    "TAN_2709.JPG",
    "TAN_2704.JPG",
    "TAN_2682.JPG",
    "TAN_2673.JPG",
    "TAN_2668.JPG",
    "TAN_2631.JPG",
    "TAN_2567.JPG",
    "TAN_2506.JPG",
    "TAN_2480.JPG",
    "TAN_2447.JPG",
    "TAN_2418.JPG",
    "TAN_2415.JPG",
    "TAN_2406.JPG",
    "TAN_2349.JPG",
    "TAN_2330.JPG",
    "TAN_2324.JPG",
    "TAN_2252.JPG",
    "TAN_2244.JPG",
    "TAN_2235.JPG",
    "TAN_2217.JPG",
    "TAN_2196.JPG",
    "TAN_2129.JPG",
    "TAN_2117.JPG",
    "TAN_2110.JPG",
    "TAN_2097.JPG",
    "TAN_2072.JPG",
    "TAN_2066.JPG",
  ];

  return (
    <main onMouseOver={(e) => dispatch(closeSubMenu())}>
      <h1>Home</h1>

      <div>
        <div className="item">
          {imagesText.map((e) => (
            <>
              <p>{e}</p>
              <img src={rootURL + e} alt="" />
            </>
          ))}
        </div>
      </div>

      {/* <ImageSlide images={null} /> */}
      <Player
        playsInline
        poster="http://localhost:8000/static/images/upload/default.jpg"
        src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
      />
    </main>
  );
}

export default Home;
