import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import phuongtienhuhongApi from "api/phuongtienhuhongApi";

const PhuongtienHuHongForm = () => {
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState({
    don_vi_quan_ly: "",
    loai_phuong_tien: "",
    nhan_hieu: "",
    nhan_hieu_sat_xi: "",
    bien_kiem_soat: "",
    nguoi_quan_ly: "", // Thêm mới
    nguyen_nhan_hu_hong: "",
    bien_phap_thuc_hien: "",
    de_xuat: "", // Thêm mới
    du_tru_kinh_phi: "", // Thêm mới
    ket_qua: "",
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
    if (generalError) setGeneralError(null);
  };

  // Hàm xử lý riêng cho số tiền để đảm bảo chỉ nhập số
  const handleNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Chỉ giữ lại số
    setFormValues({ ...formValues, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setGeneralError(null);

    try {
      // Chuyển đổi du_tru_kinh_phi sang kiểu số trước khi gửi API
      const payload = {
        ...formValues,
        du_tru_kinh_phi: parseFloat(formValues.du_tru_kinh_phi) || 0
      };

      const resp = await phuongtienhuhongApi.addPhuongtienHuHong(payload);
      
      // Xử lý logic chuyển hướng hoặc thông báo thành công
      if (resp.status === 201 || resp.status === 200 || resp.id) {
        window.location.replace("/phuongtien/huhong");
      }
    } catch (err) {
      console.error(err);
      setGeneralError("Có lỗi xảy ra khi lưu dữ liệu.");
    } finally {
      setSubmitting(false);
    }
  };

  const docSoThanhChu = (function () {
  const ChuSo = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
  const Tien = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];

  function docSoBaChuSo(baso) {
    let trăm = Math.floor(baso / 100);
    let chục = Math.floor((baso % 100) / 10);
    let đơnvị = baso % 10;
    let kếtquả = "";
    if (trăm === 0 && chục === 0 && đơnvị === 0) return "";
    if (trăm !== 0) {
      kếtquả += ChuSo[trăm] + " trăm ";
      if (chục === 0 && đơnvị !== 0) kếtquả += "lẻ ";
    }
    if (chục !== 0 && chục !== 1) {
      kếtquả += ChuSo[chục] + " mươi ";
      if (chục === 0 && đơnvị !== 0) kếtquả = kếtquả + "lẻ ";
    }
    if (chục === 1) kếtquả += "mười ";
    switch (đơnvị) {
      case 1:
        kếtquả += (chục !== 0 && chục !== 1) ? "mốt " : "một ";
        break;
      case 5:
        kếtquả += (chục === 0) ? "năm " : "lăm ";
        break;
      default:
        if (đơnvị !== 0) kếtquả += ChuSo[đơnvị] + " ";
        break;
    }
    return kếtquả;
  }

  return function (sốtiền) {
    if (sốtiền === 0) return "Không đồng";
    if (sốtiền < 0) return "Số tiền âm";
    let s = sốtiền.toString();
    let i = 0;
    let kếtquả = "";
    let vịtrí = [];
    if (isNaN(sốtiền)) return "";
    
    let n = s.length;
    while (n > 0) {
      vịtrí.push(s.substring(Math.max(0, n - 3), n));
      n -= 3;
    }
    for (i = vịtrí.length - 1; i >= 0; i--) {
      let tmp = docSoBaChuSo(parseInt(vịtrí[i]));
      if (tmp !== "") kếtquả += tmp + Tien[i] + " ";
    }
    return kếtquả.trim().charAt(0).toUpperCase() + kếtquả.trim().slice(1) + " đồng";
  };
})();

  return (
    <main onMouseOver={() => dispatch(closeSubMenu())}>
      <div className="container mt-4">
        <div className="card p-4 shadow-sm">
          <h5 className="mb-4">Thêm báo cáo phương tiện hư hỏng</h5>
          
          {generalError && <div className="alert alert-danger">{generalError}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Cột 1 */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Đội quản lý, sử dụng</label>
                  <input className="form-control" name="don_vi_quan_ly" value={formValues.don_vi_quan_ly} onChange={handleChange} placeholder="Ví dụ: Đội chữa cháy và CNCH KV Trảng Bàng"required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Loại phương tiện</label>
                  <input className="form-control" name="loai_phuong_tien" value={formValues.loai_phuong_tien} onChange={handleChange} placeholder="Ví dụ: Xe chữa cháy, Xe thang 32m" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Biển kiểm soát</label>
                  <input className="form-control" name="bien_kiem_soat" value={formValues.bien_kiem_soat} onChange={handleChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Người trực tiếp quản lý</label>
                  <input className="form-control" name="nguoi_quan_ly" value={formValues.nguoi_quan_ly} onChange={handleChange} placeholder="Ví dụ: Báo Minh Quân"/>
                </div>
              </div>

              {/* Cột 2 */}
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Nhãn hiệu</label>
                  <input className="form-control" name="nhan_hieu" value={formValues.nhan_hieu} onChange={handleChange} placeholder="Ví dụ: Hino DOL/Isuzu Morita/Man Rosenbauer/Renault Saurus/..."/>
                </div>
                <div className="mb-3">
                  <label className="form-label">Nhãn hiệu xe nền</label>
                  <input className="form-control" name="nhan_hieu_sat_xi" value={formValues.nhan_hieu_sat_xi} onChange={handleChange} placeholder="Ví dụ: Hino FG1JJUB/Isuzu FVR/MAN TGM 18.240/..."/>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Dự trù kinh phí (VNĐ)</label>
                  <input 
                    className="form-control text-danger fw-bold" 
                    name="du_tru_kinh_phi" 
                    type="text"
                    placeholder="Nhập số tiền..."
                    value={formValues.du_tru_kinh_phi} 
                    onChange={handleNumberChange} 
                  />
                  
                  {formValues.du_tru_kinh_phi && (
                    <div className="mt-2 p-2 bg-light border rounded">
                      <div className="text-muted small">
                        <strong>Số tiền:</strong> {Number(formValues.du_tru_kinh_phi).toLocaleString('vi-VN')} VNĐ
                      </div>
                      <div className="text-primary small italic">
                        <strong>Bằng chữ:</strong> <em>{docSoThanhChu(formValues.du_tru_kinh_phi)}</em>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <hr />

            <div className="mb-3">
              <label className="form-label">Nguyên nhân hư hỏng</label>
              <textarea className="form-control" name="nguyen_nhan_hu_hong" rows="3" value={formValues.nguyen_nhan_hu_hong} onChange={handleChange}></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">Biện pháp thực hiện</label>
              <textarea className="form-control" name="bien_phap_thuc_hien" rows="2" value={formValues.bien_phap_thuc_hien} onChange={handleChange}></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">Đề xuất</label>
              <textarea className="form-control" name="de_xuat" rows="2" value={formValues.de_xuat} onChange={handleChange}></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">Kết quả</label>
              <input className="form-control" name="ket_qua" value={formValues.ket_qua} onChange={handleChange} placeholder="Đã hoàn thành sửa chữa/Đang sửa chữa/Đang chờ phê duyệt chủ trương/Đang chờ báo giá/"/>
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-primary px-5" type="submit" disabled={submitting}>
                {submitting ? "Đang gửi..." : "Lưu"}
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => window.history.back()}>
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default PhuongtienHuHongForm;