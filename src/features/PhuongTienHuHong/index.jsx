import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import qlptApi from "api/qlptApi";
import phuongtienhuhongApi from "api/phuongtienhuhongApi";
import { PhuongtienHuHongForm } from "./phuongtienHuHongForm";
import Loading from "components/Loading";
import { Link } from "react-router-dom";

const PhuongTienHuHong = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // request list of phương tiện hư hỏng via dedicated api
        const resp = await phuongtienhuhongApi.getList({ size: 500, hu_hong: true });
        setItems(resp.data || resp || []);
      } catch (err) {
        console.error(err);
        setItems([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <main onMouseOver={(e) => dispatch(closeSubMenu())}>
      <Helmet>
        <title>Phương tiện hư hỏng</title>
      </Helmet>

      <div className="container">
        <div className="list-title">
          <h3>Danh sách phương tiện hư hỏng</h3>
          <Link className="btn" to="/phuongtien/huhong/add">
            Thêm
          </Link>
        </div>

        <table className="table table-striped table-responsive">
          <thead>
            <tr>
              <th scope="col">Stt</th>
              <th scope="col">Đơn vị quản lý</th>
              <th scope="col">Loại phương tiện</th>
              <th scope="col">Nhãn hiệu</th>
              <th scope="col">Nhãn hiệu (sát xi)</th>
              <th scope="col">Biển kiểm soát</th>
              <th scope="col">Nguyên nhân hư hỏng</th>
              <th scope="col">Biện pháp thực hiện</th>
              <th scope="col">Kết quả</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={9}>Không có dữ liệu</td>
              </tr>
            )}

            {items.map((item, index) => (
              <tr key={item.id}>
                <th scope="row">{index + 1}</th>
                <td>{item.don_vi_quan_ly}</td>
                <td>{item.loai_phuong_tien}</td>
                <td>{item.nhan_hieu}</td>
                <td>{item.nhan_hieu_sat_xi}</td>
                <td>{item.bien_kiem_soat}</td>
                <td style={{ whiteSpace: "pre-wrap" }}>{item.nguyen_nhan_hu_hong}</td>
                <td style={{ whiteSpace: "pre-wrap" }}>{item.bien_phap_thuc_hien}</td>
                <td>{item.ket_qua}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export { PhuongTienHuHong };
export default PhuongTienHuHong;
