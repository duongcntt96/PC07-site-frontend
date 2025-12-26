import React, { useEffect, useState } from "react";
import PageTitle from "components/PageTitle";
import { useDispatch } from "react-redux";
import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import qlptApi from "api/qlptApi";
import phuongtienhuhongApi from "api/phuongtienhuhongApi";
import { PhuongtienHuHongForm } from "./phuongtienHuHongForm";
import Loading from "components/Loading";
import { Link } from "react-router-dom";

import * as XLSX from "xlsx";

const PhuongTienHuHong = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // request list of phương tiện hư hỏng via dedicated api
        const { data } = await phuongtienhuhongApi.getList({ size: 500, hu_hong: true });
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setItems([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const totalKinhPhi = items.reduce((sum, item) => {
    // Đảm bảo giá trị là số trước khi cộng
    const value = parseFloat(item.du_tru_kinh_phi) || 0;
    return sum + value;
  }, 0);

  const exportToExcel = () => {
    // 1. Chuẩn bị dữ liệu: Chọn các cột cần xuất và đổi tên header sang tiếng Việt
    const dataToExport = items.map((item, index) => ({
      "STT": index + 1,
      "Đơn vị quản lý": item.don_vi_quan_ly,
      "Loại phương tiện": item.loai_phuong_tien,
      "Nhãn hiệu": item.nhan_hieu,
      "Biển kiểm soát": item.bien_kiem_soat,
      "Người quản lý": item.nguoi_quan_ly,
      "Nguyên nhân hư hỏng": item.nguyen_nhan_hu_hong,
      "Biện pháp thực hiện": item.bien_phap_thuc_hien,
      "Dự trù kinh phí": item.du_tru_kinh_phi,
      "Kết quả": item.ket_qua,
    }));
    dataToExport.push({
      "STT": "TỔNG CỘNG",
      "Dự trù kinh phí": totalKinhPhi,
    });

    

    // 2. Tạo sheet và workbook
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    worksheet["!cols"] = [{ wch: 5 }, { wch: 20 }, { wch: 15 }, { wch: 15 }]; // wch là độ rộng ký tự
    XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSachHuHong");

    // 3. Xuất file
    XLSX.writeFile(workbook, "Danh_sach_phuong_tien_hu_hong.xlsx");
  };

  if (loading) return <Loading />;

  return (
    <main onMouseOver={(e) => dispatch(closeSubMenu())}>
      <PageTitle title="Phương tiện hư hỏng" />

      <div className="container">
        <div className="list-title">
          <h3>Danh sách phương tiện hư hỏng</h3>
          <div className="d-flex gap-3"> {/* Thêm wrapper để các nút nằm cạnh nhau */}
            <Link className="btn btn-primary" to="/phuongtien/huhong/add">
              Thêm phương tiện hư hỏng
            </Link>
          </div>
        </div>
        <br/>
        <table className="table table-striped table-responsive">
          <thead>
            <tr>
              <th scope="col">Stt</th>
              <th scope="col">Đơn vị quản lý</th>
              <th scope="col">Loại phương tiện</th>
              <th scope="col">Nhãn hiệu</th>
              <th scope="col">Nhãn hiệu (sát xi)</th>
              <th scope="col">Biển kiểm soát</th>
              <th scope="col">Người trực tiếp quản lý</th>
              <th scope="col">Nguyên nhân hư hỏng</th>
              <th scope="col">Biện pháp thực hiện</th>
              <th scope="col">Đề xuất</th>
              <th scope="col">Dự trù kinh phí</th>
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
                <td>{item.nguoi_quan_ly}</td>
                <td style={{ whiteSpace: "pre-wrap" }}>{item.nguyen_nhan_hu_hong}</td>
                <td style={{ whiteSpace: "pre-wrap" }}>{item.bien_phap_thuc_hien}</td>
                <td style={{ whiteSpace: "pre-wrap" }}>{item.de_xuat}</td>
                <td>{item.du_tru_kinh_phi ? Number(item.du_tru_kinh_phi).toLocaleString("vi-VN")  : ""}</td>
                <td>{item.ket_qua}</td>
              </tr>
            ))}
          </tbody>
          {items.length > 0 && (
            <tfoot style={{ fontWeight: "bold", backgroundColor: "#f8f9fa" }}>
              <tr>
                {/* Colspan 10 để gộp các cột từ STT đến Đề xuất */}
                <td colSpan={10} className="text-end">Tổng cộng:</td>
                <td>{totalKinhPhi.toLocaleString("vi-VN")}</td>
                <td></td> {/* Cột Kết quả để trống */}
              </tr>
            </tfoot>
          )}
        </table>

        <div className="d-flex justify-content-end mb-3">
          <button className="btn btn-success" onClick={exportToExcel}>
            Xuất file Excel
          </button>
        </div>
      </div>
    </main>
  );
};

export { PhuongTienHuHong };
export default PhuongTienHuHong;
