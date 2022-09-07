import React, { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Loading = () => {
  const RADIAL_SPEED = 10;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((index + 1) % (360 / RADIAL_SPEED));
    }, 10);
    return () => {
      clearInterval(interval);
    };
  });

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 9999,
        backgroundColor: "blue",
        width: "100%",
        height: "100%",
        opacity: "20%",
      }}
    >
      <AiOutlineLoading3Quarters
        style={{
          transform: `rotate(${index * RADIAL_SPEED}deg) scale(5)`,
          position: "relative",
          left: "48%",
          top: "50%",
        }}
      />
    </div>
  );
};

export default Loading;
