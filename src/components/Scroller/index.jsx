import React, { useEffect, useState } from "react";
import { FaArrowCircleUp } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const Scroller = () => {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  // 1. Cuộn lên đầu trang tức thì khi chuyển trang
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // 2. Lắng nghe sự kiện scroll để hiện nút
  useEffect(() => {
    const toggleVisible = () => {
      const scrolled = document.documentElement.scrollTop;
      setVisible(scrolled > 300);
    };
    window.addEventListener("scroll", toggleVisible);
    return () => window.removeEventListener("scroll", toggleVisible);
  }, []);

  /**
   * HÀM CUỘN CHẬM TÙY CHỈNH (Custom Smooth Scroll)
   * @param {number} duration - Thời gian cuộn (ms). Càng lớn càng chậm.
   */
  const scrollToTopCustom = (duration) => {
    const start = window.pageYOffset;
    const startTime = performance.now();

    const animateScroll = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);

      // Thuật toán Ease-Out-Quad: Giúp khởi đầu nhanh và chậm dần khi về đích
      const easeOutQuad = progress * (2 - progress);

      window.scrollTo(0, start * (1 - easeOutQuad));

      if (elapsedTime < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  return (
    <div
      style={{
        position: 'fixed',
        right: '40px',
        bottom: '80px',
        zIndex: 1000,
        cursor: 'pointer',
        display: visible ? "block" : "none",
        transition: "all 0.4s ease" // Hiệu ứng ẩn hiện nút mượt
      }}
      // Bạn có thể chỉnh 1000 (1 giây) lên 2000 nếu muốn chậm hơn nữa
      onClick={() => scrollToTopCustom(1000)} 
    >
      <FaArrowCircleUp
        style={{
          fontSize: '45px',
          color: "#03b1fc",
          opacity: 0.7,
          filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.2))",
          transition: "0.3s"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "1";
          e.currentTarget.style.transform = "translateY(-5px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "0.7";
          e.currentTarget.style.transform = "translateY(0px)";
        }}
      />
    </div>
  );
};

export default Scroller;