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
    nguyen_nhan_hu_hong: "",
    bien_phap_thuc_hien: "",
    ket_qua: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState(/** @type {any} */ ({}));
  const [generalError, setGeneralError] = useState(null);

  const handleChange = (e) => {
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
    // Clear field error when user edits the input
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: null });
    if (generalError) setGeneralError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    setGeneralError(null);
    try {
      const resp = await phuongtienhuhongApi.addPhuongtienHuHong(formValues);
      console.log("phuongtienHuHong POST response:", resp);

      // Normalize response: axiosClient interceptor may return response.data for success,
      // or an axios-like response with status/data on error.
      const data = resp && resp.data ? resp.data : resp;

      // If server responded with HTTP error payload (axios-like object)
      if (resp && resp.status && resp.status >= 400) {
        const payload = resp.data || {};
        if (payload && typeof payload === "object" && Object.keys(payload).length > 0) {
          setErrors(payload);
          if (payload.non_field_errors) setGeneralError(Array.isArray(payload.non_field_errors) ? payload.non_field_errors.join(", ") : payload.non_field_errors);
        } else {
          setGeneralError(payload.detail || payload.message || "Lỗi khi lưu");
        }
        setSubmitting(false);
        return;
      }

      // Some APIs return validation object in body but with 200 status (check for array values)
      const hasFieldErrors = data && typeof data === "object" && Object.keys(data).some((k) => Array.isArray(data[k]));
      if (hasFieldErrors) {
        setErrors(data);
        if (data.non_field_errors) setGeneralError(Array.isArray(data.non_field_errors) ? data.non_field_errors.join(", ") : data.non_field_errors);
        setSubmitting(false);
        return;
      }

      // Success detection
      const success = !!((data && (data.id || data.pk)) || (resp && (resp.status === 201 || resp.status === 200)));
      if (success) {
        window.location.replace("/phuongtien/huhong");
        return;
      }

      // Fallback error
      setGeneralError("Lưu thất bại");
    } catch (err) {
      console.error(err);
      // err may be axios response returned by interceptor, or a thrown error
      const resp = err && err.data ? err : err;
      if (resp && resp.status && resp.status >= 400) {
        const payload = resp.data || resp;
        if (payload && typeof payload === "object") setErrors(payload);
        else setGeneralError(payload.detail || payload.message || "Lỗi khi lưu");
      } else {
        setGeneralError("Lỗi khi lưu");
      }
    }

    setSubmitting(false);
  };

  return (
    <main onMouseOver={() => dispatch(closeSubMenu())}>
      <div>
        <h5>Thêm báo cáo phương tiện hư hỏng</h5>
        {generalError && <div className="alert alert-danger">{generalError}</div>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Đơn vị quản lý</label>
            <input
              className="form-control"
              name="don_vi_quan_ly"
              value={formValues.don_vi_quan_ly}
              onChange={handleChange}
              required
            />
            {errors.don_vi_quan_ly && (
              <small className="text-danger">
                {Array.isArray(errors.don_vi_quan_ly) ? errors.don_vi_quan_ly.join(", ") : errors.don_vi_quan_ly}
              </small>
            )}
          </div>

          <div>
            <label>Loại phương tiện</label>
            <input
              className="form-control"
              name="loai_phuong_tien"
              value={formValues.loai_phuong_tien}
              onChange={handleChange}
              required
            />
            {errors.loai_phuong_tien && (
              <small className="text-danger">
                {Array.isArray(errors.loai_phuong_tien) ? errors.loai_phuong_tien.join(", ") : errors.loai_phuong_tien}
              </small>
            )}
          </div>

          <div>
            <label>Nhãn hiệu</label>
            <input
              className="form-control"
              name="nhan_hieu"
              value={formValues.nhan_hieu}
              onChange={handleChange}
            />
            {errors.nhan_hieu && (
              <small className="text-danger">
                {Array.isArray(errors.nhan_hieu) ? errors.nhan_hieu.join(", ") : errors.nhan_hieu}
              </small>
            )}
          </div>

          <div>
            <label>Nhãn hiệu (sát xi)</label>
            <input
              className="form-control"
              name="nhan_hieu_sat_xi"
              value={formValues.nhan_hieu_sat_xi}
              onChange={handleChange}
            />
            {errors.nhan_hieu_sat_xi && (
              <small className="text-danger">
                {Array.isArray(errors.nhan_hieu_sat_xi) ? errors.nhan_hieu_sat_xi.join(", ") : errors.nhan_hieu_sat_xi}
              </small>
            )}
          </div>

          <div>
            <label>Biển kiểm soát</label>
            <input
              className="form-control"
              name="bien_kiem_soat"
              value={formValues.bien_kiem_soat}
              onChange={handleChange}
            />
            {errors.bien_kiem_soat && (
              <small className="text-danger">
                {Array.isArray(errors.bien_kiem_soat) ? errors.bien_kiem_soat.join(", ") : errors.bien_kiem_soat}
              </small>
            )}
          </div>

          <div>
            <label>Nguyên nhân hư hỏng</label>
            <textarea
              className="form-control"
              name="nguyen_nhan_hu_hong"
              value={formValues.nguyen_nhan_hu_hong}
              onChange={handleChange}
            />
            {errors.nguyen_nhan_hu_hong && (
              <small className="text-danger">
                {Array.isArray(errors.nguyen_nhan_hu_hong) ? errors.nguyen_nhan_hu_hong.join(", ") : errors.nguyen_nhan_hu_hong}
              </small>
            )}
          </div>

          <div>
            <label>Biện pháp thực hiện</label>
            <textarea
              className="form-control"
              name="bien_phap_thuc_hien"
              value={formValues.bien_phap_thuc_hien}
              onChange={handleChange}
            />
            {errors.bien_phap_thuc_hien && (
              <small className="text-danger">
                {Array.isArray(errors.bien_phap_thuc_hien) ? errors.bien_phap_thuc_hien.join(", ") : errors.bien_phap_thuc_hien}
              </small>
            )}
          </div>

          <div>
            <label>Kết quả</label>
            <input
              className="form-control"
              name="ket_qua"
              value={formValues.ket_qua}
              onChange={handleChange}
            />
            {errors.ket_qua && (
              <small className="text-danger">
                {Array.isArray(errors.ket_qua) ? errors.ket_qua.join(", ") : errors.ket_qua}
              </small>
            )}
          </div>

          <br />
          <button className="form-control" type="submit" disabled={submitting}>
            {submitting ? "Đang gửi..." : "Lưu"}
          </button>
        </form>
      </div>
    </main>
  );
};

export { PhuongtienHuHongForm };
export default PhuongtienHuHongForm;
