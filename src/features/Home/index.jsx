import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import PageTitle from "components/PageTitle";

import TTSControls from "components/TTSControls";

import "./style.css";

function Home() {
  const dispatch = useDispatch();

  const videos = [
    {
      id: "robot",
      title: "Robot chữa cháy và cứu nạn, cứu hộ",
      src: "https://www.youtube.com/embed/QocEbM-IhN4?si=_jE7_TMiaORTkWTu",
    },
    {
      id: "uav",
      title: "UAV chữa cháy và cứu nạn, cứu hộ",
      src: "https://www.youtube.com/embed/SelIpemhIow?si=DkT0Nt40CohZIqku",
    },
    {
      id: "sensord",
      title: "Thiết bị cảm biến tìm kiếm người bị nạn - Savox LD3",
      src: "https://www.youtube.com/embed/_h4dhKWj4j4?si=TH1I7TCGy7n4WTtk",
      note: "Cảm biến địa chấn: Savox Delsar Life Detector LD3",
    },
    {
      id: "sensorav",
      title: "Thiết bị cảm biến âm thanh/hình ảnh - Savox SC3000",
      src: "https://www.youtube.com/embed/32dxkPw7bDI?si=iQxnxK2OnunEnzLm",
      note: "Cảm biến âm thanh, hình ảnh: Savox SearchCam SC3000",
    },
    {
      id: "gis",
      title: "Hệ thống quản lý, giám sát thông minh trên nền tảng bản đồ số",
      src: "https://www.youtube.com/embed/snO9q1tt68Q?si=-ypFOaqVhNnbaPlh",
    },
  ];

  // TTS behavior moved to `TTSControls` component (uses `useTTS` hook).
  // This keeps Home focused on layout and video cards.

  const VideoCard = ({ v }) => (
    <section className="video-card">
      <h4>{v.title}</h4>
      {v.note && <h5>{v.note}</h5>}
      <div className="video-responsive">
        <iframe
          src={v.src}
          title={v.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
    </section>
  );

  return (
    <main onMouseOver={(e) => dispatch(closeSubMenu())}>
      <PageTitle title="Trang chủ" />

      <div className="home-container">
        <div className="content">
          {videos.map((v) => (
            <VideoCard v={v} key={v.id} />
          ))}
        </div>

        <aside className="sidebar">
          <div style={{ marginBottom: 16 }}>
            <TTSControls />
          </div>

          <div style={{ marginTop: 16 }} className="video-card">
            <h4>Tài liệu & Liên kết</h4>
            <ul>
              <li><a href="/thuvien/tspl">Tủ sách pháp luật</a></li>
              <li><a href="/thuvien/tlnv">Tài liệu nghiệp vụ</a></li>
              <li><a href="/phuongtien/huhong">Báo cáo phương tiện hư hỏng</a></li>
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default Home;
