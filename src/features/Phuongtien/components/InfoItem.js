import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { Link } from "react-router-dom";

const PhuongtienItem = ({
  id,
  ten,
  don_vi_tinh,
  so_luong,
  nhan_hieu,
  so_khung,
  so_may,
  so_dong_co,
  bien_so,
  nguon_cap,
  thoi_gian_nhan,
  thoi_gian_san_xuat,
  thoi_gian_dua_vao_hoat_dong,
  chung_loai,
  chung_loai__ten,
  trang_thai,
  trang_thai__ten,
  chat_luong,
  chat_luong__ten,
  noi_bo_tri,
  noi_bo_tri__ten,
  quan_ly,
  quan_ly__name,
}) => {
  const [editing, setEditing] = useState(false);
  return (
    <div className="col-sm-6">
      <div className="col">
        <div className="alert alert-success" role="alert">
          <div className="alert-heading">
            <div className="row">
              <div className="col-sm-11">
                <h3>{ten}</h3>
              </div>
              <div
                className="col-sm-1"
                style={{ color: "green", padding: "4px" }}
              >
                <FiEdit
                  onClick={(e) => {
                    setEditing(!editing);
                  }}
                />
              </div>
            </div>
          </div>
          <table>
            <tbody>
              <tr>
                <td>Chủng loại:</td>
                <td>
                  <Link to={`/phuongtien/?chung_loai=${chung_loai}`}>
                    {chung_loai__ten}
                  </Link>
                </td>
              </tr>
              <tr>
                <td>Nhãn hiệu:</td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    style={{ padding: 0 }}
                    value={nhan_hieu}
                    disabled={!editing}
                  />
                </td>
              </tr>

              <tr>
                <td>Biển số:</td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    style={{ padding: 0 }}
                    value={bien_so}
                    disabled={!editing}
                  />
                </td>
              </tr>

              <tr>
                <td>Số khung:</td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    style={{ padding: 0 }}
                    value={so_khung}
                    disabled={!editing}
                  />
                </td>
              </tr>

              <tr>
                <td>Số máy:</td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    style={{ padding: 0 }}
                    value={so_may}
                    disabled={!editing}
                  />
                </td>
              </tr>

              <tr>
                <td>Số động cơ:</td>
                <td>
                  <input
                    className="form-control"
                    style={{ padding: 0 }}
                    type="text"
                    value={so_dong_co}
                    disabled={!editing}
                  />
                </td>
              </tr>

              <tr>
                <td>Số lượng:</td>
                <td>
                  {so_luong} {don_vi_tinh}
                </td>
              </tr>
              <tr>
                <td>Nơi bố trí:</td>
                <td>
                  <Link to={`/phuongtien/${noi_bo_tri}`}>
                    {noi_bo_tri__ten}
                  </Link>
                </td>
              </tr>
              <tr>
                <td>Quản lý:</td>
                <td>
                  <Link to={`/phuongtien/?quan_ly=${quan_ly}`}>
                    {quan_ly__name}
                  </Link>
                </td>
              </tr>
              <tr>
                <td>Trạng thái:</td>
                <td>
                  <Link
                    to={`/phuongtien/?chung_loai=${chung_loai}&trang_thai=${trang_thai}`}
                  >
                    {trang_thai__ten}
                  </Link>
                  <select
                    className="form-control"
                    name="quan_ly"
                    value={trang_thai__ten}
                    onChange={(e) => {
                      // handleChange(e);
                    }}
                  >
                    <option value="">Tất cả</option>
                    <option value="">1</option>
                    <option value="">2</option>
                    {/* {to.map((item) => (
                      <option value={item.id}>{item.name}</option>
                    ))} */}
                  </select>
                </td>
              </tr>
              <tr>
                <td>Chất lượng:</td>
                <td>
                  <Link
                    to={`/phuongtien/?chung_loai=${chung_loai}&chat_luong=${chat_luong}`}
                  >
                    {chat_luong__ten}
                  </Link>
                </td>
              </tr>
              <tr>
                <td>Nguồn cấp:</td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    style={{ padding: 0 }}
                    value={nguon_cap}
                    disabled={!editing}
                  />
                </td>
              </tr>
              <tr>
                <td>Thời gian nhận:</td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    style={{ padding: 0 }}
                    value={thoi_gian_nhan}
                    disabled={!editing}
                  />
                </td>
              </tr>
              <tr>
                <td>Thời gian sản xuất:</td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    style={{ padding: 0 }}
                    value={thoi_gian_san_xuat}
                    disabled={!editing}
                  />
                </td>
              </tr>
              <tr>
                <td>Thời gian đưa vào hoạt động:</td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    style={{ padding: 0 }}
                    value={thoi_gian_dua_vao_hoat_dong}
                    disabled={!editing}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PhuongtienItem;
