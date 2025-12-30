import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import XLSX from 'xlsx-js-style';

// Components
import PageTitle from "components/PageTitle";
import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import phuongtienhuhongApi from "api/phuongtienhuhongApi";
import Loading from "components/Loading";

const PhuongTienHuHong = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDonVi, setFilterDonVi] = useState("");
  const [selectedKetQua, setSelectedKetQua] = useState([]);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
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

  // --- Logic Filtering ---
  const danhSachDonVi = useMemo(() => [...new Set(items.map(i => i.don_vi_quan_ly))].filter(Boolean).sort(), [items]);
  const danhSachKetQua = useMemo(() => [...new Set(items.map(i => i.ket_qua || "Chưa xác định"))].filter(Boolean).sort(), [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchSearch = (item.bien_kiem_soat || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.nhan_hieu || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchDonVi = filterDonVi === "" || item.don_vi_quan_ly === filterDonVi;
      const itemKQ = item.ket_qua || "Chưa xác định";
      const matchKetQua = selectedKetQua.length === 0 || selectedKetQua.includes(itemKQ);
      return matchSearch && matchDonVi && matchKetQua;
    });
  }, [items, searchTerm, filterDonVi, selectedKetQua]);

  const totalKinhPhi = useMemo(() => {
    return filteredItems.reduce((sum, item) => sum + (parseFloat(item.du_tru_kinh_phi) || 0), 0);
  }, [filteredItems]);

  // --- Handlers ---
  const handleSelectAllKetQua = () => {
    setSelectedKetQua(prev => prev.length === danhSachKetQua.length ? [] : danhSachKetQua);
  };

  const handleKetQuaChange = (val) => {
    setSelectedKetQua(prev => prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val]);
  };

  const exportToExcel = () => {
    const dataToExport = filteredItems.map((item, index) => ({
      "Stt": index + 1,
      "Đơn vị quản lý": item.don_vi_quan_ly,
      "Loại phương tiện": item.loai_phuong_tien,
      "Nhãn hiệu": item.nhan_hieu,
      "Biển kiểm soát": item.bien_kiem_soat,
      "Nguyên nhân hư hỏng": item.nguyen_nhan_hu_hong,
      "Dự trù kinh phí": Number(item.du_tru_kinh_phi) || 0,
      "Kết quả": item.ket_qua || "Chưa xác định",
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSach");
    XLSX.writeFile(workbook, "Danh_sach_phuong_tien_hu_hong.xlsx");
  };

  if (loading) return <Loading />;

  return (
    <main onMouseOver={() => dispatch(closeSubMenu())}>
      <style>{`
        /* SỬA LỖI ĐÈ CHỮ Ở BỘ LỌC */
        .filter-section {
          background: #fff;
          padding: 24px;
          border-radius: 12px;
          margin-bottom: 25px;
          border: 1px solid #e2e8f0;
          position: relative; 
          z-index: 100;
        }

        .filter-section .form-control, 
        .filter-section .form-select {
          width: 100% !important;
          height: 42px !important;
          border-radius: 8px !important;
          box-sizing: border-box !important;
        }

        .dropdown-select-custom { position: relative; width: 100%; }
        .dropdown-menu-custom {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          width: 100%;
          min-width: 250px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          z-index: 999;
          padding: 12px;
          border: 1px solid #e2e8f0;
          margin-top: 5px;
        }
        .dropdown-select-custom:hover .dropdown-menu-custom { display: block; }

        /* GIỮ NGUYÊN STYLE TABLE GỐC */
        .table-card {
          background: #fff;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          overflow: visible;
        }

        .table-responsive {
          width: 100%;
          overflow-x: auto;
          overflow-y: visible; 
        }

        .table-custom {
          width: 100%;
          min-width: 1300px;
          border-collapse: separate;
          border-spacing: 0;
          table-layout: fixed;
        }

        .table-custom thead th {
          background: #f1f5f9;
          color: #334155;
          font-weight: 700;
          padding: 14px 8px;
          border-bottom: 2px solid #cbd5e1;
          position: sticky;
          top: 0;
          z-index: 10;
          text-align: center;
        }

        .table-custom tbody td {
          padding: 12px 8px;
          border-bottom: 1px solid #e2e8f0;
          vertical-align: top;
          word-wrap: break-word;
          font-size: 14px;
        }

        .w-stt { width: 50px; }
        .w-donvi { width: 160px; }
        .w-loai { width: 120px; }
        .w-nhanhieu { width: 110px; }
        .w-bienso { width: 120px; }
        .w-quanly { width: 130px; }
        .w-noidung { width: 280px; }
        .w-kinhphi { width: 130px; }
        .w-ketqua { width: 120px; }

        .text-justify { text-align: justify; line-height: 1.5; white-space: pre-wrap; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        
        .badge-status {
          padding: 6px 4px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          display: block;
          text-align: center;
        }
      `}</style>

      <div className="container-fluid px-4 py-3" style={{background: '#f8fafc', minHeight: '100vh'}}>
        <PageTitle title="Phương tiện hư hỏng" />

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold m-0" style={{color: '#0f172a'}}>Quản lý phương tiện hư hỏng</h3>
          <Link className="btn btn-primary" style={{borderRadius: '8px', padding: '10px 20px'}} to="/phuongtien/huhong/add">
            <i className="fa fa-plus me-2"></i>Thêm mới
          </Link>
        </div>

        {/* BỘ LỌC TỐI ƯU CỘT (Sửa lỗi đè chữ) */}
        <div className="filter-section shadow-sm">
          <div className="row g-4 flex-wrap align-items-end"> 
            <div className="col-12 col-md-6 col-lg-4">
              <label className="small fw-bold text-secondary mb-2 d-block">TÌM KIẾM</label>
              <div className="position-relative">
                <i className="fa fa-search position-absolute" style={{left: '12px', top: '12px', color: '#94a3b8'}}></i>
                <input 
                  type="text" className="form-control ps-5" 
                  placeholder="Biển số hoặc nhãn hiệu..." 
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} 
                />
              </div>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <label className="small fw-bold text-secondary mb-2 d-block">ĐƠN VỊ QUẢN LÝ</label>
              <select 
                className="form-select" 
                value={filterDonVi} onChange={(e) => setFilterDonVi(e.target.value)}
              >
                <option value="">Tất cả đơn vị</option>
                {danhSachDonVi.map(dv => <option key={dv} value={dv}>{dv}</option>)}
              </select>
            </div>

            <div className="col-12 col-sm-6 col-lg-3">
              <label className="small fw-bold text-secondary mb-2 d-block">KẾT QUẢ</label>
              <div className="dropdown-select-custom">
                <div className="form-control d-flex justify-content-between align-items-center" style={{cursor: 'pointer'}}>
                  <span className="text-truncate">{selectedKetQua.length === 0 ? "Tất cả trạng thái" : `Đã chọn (${selectedKetQua.length})`}</span>
                  <i className="fa fa-chevron-down small text-muted"></i>
                </div>
                <div className="dropdown-menu-custom">
                  <div className="d-flex justify-content-between border-bottom pb-2 mb-2">
                    <span className="text-primary fw-bold" style={{fontSize: '12px', cursor: 'pointer'}} onClick={handleSelectAllKetQua}>
                      {selectedKetQua.length === danhSachKetQua.length ? "Bỏ chọn" : "Chọn tất cả"}
                    </span>
                    <span className="text-danger fw-bold" style={{fontSize: '12px', cursor: 'pointer'}} onClick={() => setSelectedKetQua([])}>Xóa</span>
                  </div>
                  {danhSachKetQua.map(kq => (
                    <label key={kq} className="d-flex align-items-center mb-2" style={{cursor: 'pointer'}}>
                      <input type="checkbox" className="me-2" checked={selectedKetQua.includes(kq)} onChange={() => handleKetQuaChange(kq)} />
                      <span style={{fontSize: '13.5px'}}>{kq}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-2">
                <button className="btn btn-success w-100 fw-bold shadow-sm" style={{height: '42px', borderRadius: '8px'}} onClick={exportToExcel}>
                  <i className="fa fa-file-excel-o me-2"></i>XUẤT EXCEL
                </button>
            </div>
          </div>
        </div>

        {/* BẢNG DỮ LIỆU - NGUYÊN BẢN CỦA BẠN */}
        <div className="table-card shadow-sm">
          <div className="table-responsive">
            <table className="table-custom">
              <thead>
                <tr>
                  <th className="w-stt">Stt</th>
                  <th className="w-donvi">Đơn vị quản lý</th>
                  <th className="w-loai">Loại PT</th>
                  <th className="w-nhanhieu">Nhãn hiệu</th>
                  <th className="w-nhanhieu">Sát xi</th>
                  <th className="w-bienso">Biển số</th>
                  <th className="w-quanly">Người QL</th>
                  <th className="w-noidung">Nguyên nhân hư hỏng</th>
                  <th className="w-noidung">Biện pháp thực hiện</th>
                  <th className="w-noidung">Đề xuất</th>
                  <th className="w-kinhphi">Dự trù kinh phí</th>
                  <th className="w-ketqua">Kết quả</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => {
                  // Xác định màu sắc cho cột kết quả
                  const isFinished = item.ket_qua.includes('Đã hoàn thành') || item.ket_qua.includes('Đã sửa xong');
                  
                  return (
                    <tr key={item.id} style={{background: index % 2 === 0 ? '#fff' : '#f9fafb'}}>
                      <td className="text-center text-muted">{index + 1}</td>
                      <td className="fw-bold" style={{color: '#334155'}}>{item.don_vi_quan_ly}</td>
                      <td className="text-center">{item.loai_phuong_tien}</td>
                      <td className="text-center">{item.nhan_hieu}</td>
                      <td className="text-center">{item.nhan_hieu_sat_xi}</td>
                      <td className="text-center fw-bold text-primary">{item.bien_kiem_soat}</td>
                      <td className="text-center">{item.nguoi_quan_ly}</td>
                      <td className="text-justify">{item.nguyen_nhan_hu_hong}</td>
                      <td className="text-justify">{item.bien_phap_thuc_hien}</td>
                      <td className="text-justify">{item.de_xuat}</td>
                      <td className="text-right fw-bold" style={{color: '#0f172a'}}>
                        {item.du_tru_kinh_phi ? Number(item.du_tru_kinh_phi).toLocaleString("vi-VN") : "0"}
                      </td>
                      <td>
                        <span className={`badge-status ${isFinished ? 'bg-success text-white' : 'bg-warning text-dark'}`}>
                          {item.ket_qua || 'Đang xử lý'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredItems.length > 0 && (
            <div className="p-3 bg-white border-top d-flex justify-content-end align-items-center">
              <span className="fw-bold text-secondary me-3">TỔNG CỘNG:</span>
              <span className="fs-5 fw-bold text-danger">{totalKinhPhi.toLocaleString("vi-VN")} VNĐ</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default PhuongTienHuHong;