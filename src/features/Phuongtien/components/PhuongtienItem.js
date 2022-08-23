import React from "react";
import { Link } from "react-router-dom";

const PhuongtienItem = ({
  id,
  ten,
  hinh_anh,
  bien_so,
  nhan_hieu,
  noi_bo_tri,
  noi_bo_tri__ten,
  trang_thai,
  trang_thai__ten,
}) => {
  return (
    <Link to={`/phuongtien/${id}`}>
      <div className="pt-item">
        <div className="pt-item-img">
          <img
            src={
              hinh_anh
                ? "http://localhost:8000" + hinh_anh
                : "http://localhost:8000/static/images/upload/default.jpg"
            }
            alt="chưa có hình ảnh"
          />
        </div>
        <div className="pt-item-info">
          <h4>{bien_so || ten}</h4>
          <p>{nhan_hieu}</p>
          <p> {noi_bo_tri__ten} </p>
          <p> {trang_thai__ten} </p>
        </div>
      </div>
    </Link>
  );
};

export default PhuongtienItem;
