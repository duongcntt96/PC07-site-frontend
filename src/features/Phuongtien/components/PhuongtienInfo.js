import phuongtienApi from "api/phuongtienApi";
import React, { useEffect, useState } from "react";

const PhuongtienInfo = (props) => {
  const id = props.match.params.id;
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState({});
  const [children, setChildren] = useState([]);

  useEffect(() => {
    const getPTInfo = async () => {
      const respone = await phuongtienApi.get(id);
      setInfo(respone);
      setLoading(false);
      console.log(respone);
    };
    getPTInfo();
  }, []);

  useEffect(() => {
    const getChildren = async () => {
      const respone = await phuongtienApi.getChildren(id);
      setChildren(respone);
      console.log(respone);
    };
    getChildren();
  }, []);

  if (!loading) {
    const { ten, nhan_hieu, hinh_anh, chung_loai, bien_so } = info;
    return (
      <main>
        <div className="container">
          <div className="row pt-content">
            <div className="col ">
              <div>
                <img
                  className="img-pt"
                  src={hinh_anh || "/static/images/upload/default.jpg"}
                  alt="chưa có hình ảnh"
                />
              </div>
            </div>
            <div className="col">
              <div className="alert alert-success" role="alert">
                <div className="alert-heading">
                  <h3>{ten}</h3>
                </div>
                <table>
                  <tbody>
                    <tr>
                      <td>Chủng loại:</td>
                      <td>{chung_loai}</td>
                    </tr>
                    <tr>
                      <td>Nhãn hiệu:</td>
                      <td>{nhan_hieu}</td>
                    </tr>

                    <tr>
                      <td>Biển số:</td>
                      <td>
                        <b>{bien_so}</b>
                      </td>
                    </tr>

                    <tr>
                      <td>Số khung:</td>
                      <td>{info.so_khung} </td>
                    </tr>

                    <tr>
                      <td>Số máy:</td>
                      <td>{info.so_may} </td>
                    </tr>

                    <tr>
                      <td>Số động cơ:</td>
                      <td>{info.so_dong_co} </td>
                    </tr>

                    <tr>
                      <td>Số lượng:</td>
                      <td>
                        {info.so_luong} {info.don_vi_tinh}
                      </td>
                    </tr>
                    <tr>
                      <td>Nơi bố trí:</td>
                      <td>
                        <a href="adasf">{info.noi_bo_tri}</a>
                      </td>
                    </tr>
                    <tr>
                      <td>Quản lý:</td>
                      <td>{info.nguoi_quan_ly}</td>
                    </tr>
                    <tr>
                      <td>Trạng thái:</td>
                      <td>{info.trang_thai}</td>
                    </tr>
                    <tr>
                      <td>Chất lượng:</td>
                      <td>{info.chat_luong}</td>
                    </tr>
                    <tr>
                      <td>Nguồn cấp:</td>
                      <td>{info.nguon_cap}</td>
                    </tr>
                    <tr>
                      <td>Thời gian nhận:</td>
                      <td>{info.thoi_gian_nhan}</td>
                    </tr>
                    <tr>
                      <td>Thời gian sản xuất:</td>
                      <td>{info.thoi_gian_san_xuat}</td>
                    </tr>
                    <tr>
                      <td>Thời gian đưa vào hoạt động:</td>
                      <td>{info.thoi_gian_dua_vao_hoat_dong}</td>
                    </tr>
                    <tr>
                      <td>Phương tiện đi kèm:</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="row">
            <h3>Phương tiện theo xe:</h3>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Stt</th>
                  <th scope="col">Tên</th>
                  <th scope="col">Số lượng</th>
                  <th scope="col">Đơn vị tính</th>
                </tr>
              </thead>
              <tbody>
                {children.map((pt, index) => {
                  const { ten, so_luong, don_vi_tinh } = pt;
                  return (
                    <tr key={index}>
                      <th scope="row">{index + 1}</th>
                      <td>{ten}</td>
                      <td>{so_luong}</td>
                      <td>{don_vi_tinh}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    );
  }
  return <h1>Loading...</h1>;
};

export default PhuongtienInfo;
