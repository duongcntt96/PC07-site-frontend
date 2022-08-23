import React from "react";
import { Fade } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

function ImageSlide({ images }) {
  return (
    <div className="slide-container">
      <Fade>
        {images.map((img, index) => (
          <div className="each-fade" key={index}>
            <div className="image-container">
              <img style={{ maxHeight: "420px" }} src={img.hinh_anh} alt="" />
            </div>
          </div>
        ))}
      </Fade>
    </div>
  );
}

export default ImageSlide;
