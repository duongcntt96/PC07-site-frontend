import phuongtienApi from "api/phuongtienApi";
import React, { useEffect, useState } from "react";

const PhuongtienItem = ({ id }) => {
  const [info, setInfo] = useState({});

  useEffect(() => {
    const getInfo = async (id) => {
      const rp = await phuongtienApi.get(id);
      setInfo(rp);
      console.log(rp);
    };
    getInfo(id);
  }, [id]);

  return (
    <div
      className="pt-item"
      onClick={() => {
        document.location.href = `/phuongtien/${id}`;
      }}
    >
      <div className="pt-item-img">
        <img
          src={
            info.hinh_anh ||
            "http://localhost:8000/static/images/upload/default.jpg"
          }
          alt="chưa có hình ảnh"
        />
      </div>

      <div className="pt-item-info">
        <h4>{info.bien_so || info.ten}</h4>
        <p>{info.nhan_hieu} </p>
        <p>{info.noibotri} </p>
        <p>{info.trangthai} </p>
      </div>
    </div>
  );
};

export default PhuongtienItem;
