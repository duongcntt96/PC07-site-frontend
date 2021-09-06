import React, { useEffect, useState } from "react";
import { FaArrowCircleUp } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const Scroller = () => {
  //   On top if goto new URL
  const location = useLocation();
  useEffect(() => {
    scrollToTop(false);
  }, [location]);

  //   Show/Hide btn
  const [visible, setVisible] = useState(false);
  const toggleVisible = () => {
    const scrolled = document.documentElement.scrollTop;
    if (scrolled > 300) {
      setVisible(true);
    } else if (scrolled <= 300) {
      setVisible(false);
    }
  };

  // Listener scroll event
  window.addEventListener("scroll", toggleVisible);

  // Goto top function
  const scrollToTop = (isSmoothScroll) => {
    window.scrollTo({
      top: 0,
      behavior: isSmoothScroll ? "smooth" : "auto",
    });
  };

  return (
    <div className="btn-scroll">
      <FaArrowCircleUp
        onClick={() => scrollToTop(true)}
        style={{
          opacity: 0.5,
          transform: "scale(3)",
          color: "#03b1fc",
          display: visible ? "inline" : "none",
        }}
      />
    </div>
  );
};

export default Scroller;
