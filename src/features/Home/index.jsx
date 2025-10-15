import ImageSlide from "components/ImageSlide";
import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

import "video-react/dist/video-react.css"; // import css
import { Player } from "video-react";
import qlptApi from "api/qlptApi";

import "./style.css";
import wall from "../../assets/images/1.jpg";
import avatar from "../../assets/images/2.jpg";

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

  const [text, setText] = useState("");
  const [mp3, setMp3] = useState(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    const fetchData = async () => {
      setMp3(null);
      const id = (await qlptApi.textToMp3({ text: text })).data;
      setMp3(id);
      playAudio(id);
    };
    fetchData();
  };

  const playAudio = (id) => {
    var audio = new Audio(`http://localhost:8000/${id}`);
    audio.play();
  };

  return (
    <main onMouseOver={(e) => dispatch(closeSubMenu())}>
      <h1>Home</h1>

      <div className="box">
        <div className="wall">
          <img src={wall} alt="" />
        </div>
        <div className="avatar">
          <img src={avatar} alt="" />
          <div className="circle">
            <div className="circle-box">

              <iframe width="560" height="315" src="https://www.youtube.com/embed/QocEbM-IhN4?si=_jE7_TMiaORTkWTu" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
              
            </div>
          </div>
        </div>
      </div>

      <h3>Text to speak</h3>
      {mp3 && (
        <audio controls autoPlay={false}>
          <source src={`http://localhost:8000/${mp3}`} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}

      <button
        onClick={() => {
          playAudio(mp3);
        }}
      >
        Play
      </button>

      <form action="" onSubmit={handleSubmit}>
        <div>
          <textarea
            name="text"
            placeholder="Nhập văn bản..."
            cols="60"
            rows="10"
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>

        <button>Submit</button>
      </form>

      {/* <div>
        <div className="item">
          {imagesText.map((e) => (
            <>
              <p>{e}</p>
              <img src={rootURL + e} alt="" />
            </>
          ))}
        </div>
      </div> */}

      {/* <ImageSlide images={null} /> */}
      {/* <Player
        playsInline
        poster="http://localhost:8000/static/images/upload/default.jpg"
        src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
      /> */}
    </main>
  );
}

export default Home;
