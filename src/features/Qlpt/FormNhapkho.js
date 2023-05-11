import qlptApi from "api/qlptApi";
import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Filter from "features/Coso/components/Filter";
import { pushURL, VNDFormat } from "./Utils/DWUtils";
import { useParams } from "react-router-dom";
import { RiDeleteBin5Line, RiSave2Fill } from "react-icons/ri";
import { BiAddToQueue } from "react-icons/bi";

const FormNhapkho = () => {
  const dispatch = useDispatch();
  const paramsURL = new URLSearchParams(window.location.search);
  const [id, setID] = useState(useParams().id || paramsURL.get("id"));

  const [phuongTienValues, setPhuongTienValues] = useState({
    so_luong: null,
    nam_cap: null,
    nguyen_gia: null,
    thanh_tien: null,
    phuong_tien: null,
    nguon_cap: null,
  });
  const [formValues, setFormValues] = useState({
    phuong_tiens: [],
    success: false,
  });

  const [listPhuongtien, setListPhuongtien] = useState([]);
  const [kho, setKho] = useState([]);
  const [nguoncap, setNguoncap] = useState([]);

  // get const data list
  useEffect(() => {
    const fetchData = async () => {
      setListPhuongtien(
        await (
          await qlptApi.getListPhuongtien({ to_import: true })
        ).data
      );
      setKho(await (await qlptApi.getListKho()).data);
      setNguoncap(await (await qlptApi.getListNguoncap()).data);
    };
    fetchData();
  }, []);

  // get condition data
  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        setFormValues(await qlptApi.getPhieunhap(id));
      }
    };
    fetchData();
  }, [id]);

  // rewrite data
  useEffect(() => {
    setPhuongTienValues({
      ...phuongTienValues,
      thanh_tien: phuongTienValues.nguyen_gia * phuongTienValues.so_luong,
    });
  }, [phuongTienValues.nguyen_gia, phuongTienValues.so_luong]);
  useEffect(() => {
    setPhuongTienValues({
      ...phuongTienValues,
      nguyen_gia: phuongTienValues.so_luong
        ? phuongTienValues.thanh_tien / phuongTienValues.so_luong
        : 0,
    });
  }, [phuongTienValues.thanh_tien, phuongTienValues.so_luong]);

  // Update input data
  const handleFormValuesChange = (e) => {
    if (e.target.type === "radio") {
      setFormValues({
        ...formValues,
        [e.target.name]: !formValues[e.target.name],
      });
    } else setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };
  // Update input data
  const handlePhuongTienValuesChange = (e) => {
    if (e.target.type === "radio") {
      alert(e.target.name + ":" + e.target.checked);
      setPhuongTienValues({
        ...phuongTienValues,
        [e.target.name]: e.target.checked,
      });
    } else
      setPhuongTienValues({
        ...phuongTienValues,
        [e.target.name]: e.target.value,
      });
  };

  // Push request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      const result = await qlptApi.updatePhieunhap({ ...formValues, id: id });
    } else {
      const result = await qlptApi.addPhieunhap({ ...formValues });
      const ID = await result.id;
      setID(ID);
      pushURL({ id: ID });
    }
  };

  // Push request
  const handleSubSubmit = async (e) => {
    e.preventDefault();
    const id2 = id;
    setID(null);
    const result = await qlptApi.addChitietPhieunhap({
      ...phuongTienValues,
      phieu_nhap: id2,
    });
    if (result && result.status !== 400) {
      setPhuongTienValues({
        so_luong: null,
        nam_cap: null,
        nguyen_gia: null,
        phuong_tien: null,
        nguon_cap: null,
      });
    } else alert("Lỗi");
    setID(id2);
  };
  // Push request
  const delItem = async (ID) => {
    const id2 = id;
    setID(null);
    const result = await qlptApi.delChitietPhieunhap(ID);
    if (result && result.status !== 400) {
      // alert("Xóa rồi");
    } else alert("Lỗi");
    setID(id2);
  };

  return (
    <main onMouseOver={(e) => dispatch(closeSubMenu())}>
      <div>
        <h5>{id ? "Chỉnh sửa phiếu nhập" : "Nhập phương tiện"}</h5>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Lý do nhập: </label>
            <input
              className="form-control"
              type="text"
              name="note"
              placeholder="Bộ Công an cấp/Tự mua sắm/Thu hồi/..."
              value={formValues.note}
              onChange={handleFormValuesChange}
            />
          </div>

          <div>
            <label>Quyết định số: </label>
            <input
              className="form-control"
              type="text"
              name="quyetdinh"
              placeholder="123/QĐ-CAT, ngày 1/1/2022"
              value={formValues.quyetdinh}
              onChange={handleFormValuesChange}
            />
          </div>

          <div>
            <label>Ngày tháng nhập/xuất: </label>
            <input
              className="form-control"
              type="date"
              name="thoi_gian"
              value={formValues.thoi_gian}
              onChange={handleFormValuesChange}
            />
          </div>

          <div>
            <label>Xuất từ kho: </label>
            <Filter
              title="Chọn kho xuất"
              name="kho_xuat"
              target={formValues}
              filters={kho}
              handleChange={handleFormValuesChange}
            />
          </div>
          <div>
            <label>Nhập vào kho: </label>
            <Filter
              title="Chọn kho nhập"
              name="kho_nhap"
              target={formValues}
              filters={kho}
              handleChange={handleFormValuesChange}
            />
          </div>
          <div>
            <span>Đã thực hiện: </span>
            <input
              type="radio"
              name="success"
              checked={formValues.success}
              onClick={handleFormValuesChange}
            />
          </div>

          <p>Danh mục phương tiện:</p>
          <div className="alert alert-success">
            <table>
              <tr>
                <th style={{ width: "50px", textAlign: "center" }}>Stt</th>
                <th style={{ width: "450px", textAlign: "center" }}>
                  Tên phương tiện
                </th>
                <th style={{ width: "90px", textAlign: "center" }}>Số lượng</th>
                <th style={{ width: "150px", textAlign: "center" }}>
                  Nguồn cấp
                </th>
                <th style={{ width: "90px", textAlign: "center" }}>Năm cấp</th>
                <th style={{ width: "120px", textAlign: "center" }}>
                  Nguyên giá
                </th>
                <th style={{ width: "120px", textAlign: "center" }}>
                  Thành tiền
                </th>
              </tr>
              {formValues.phuong_tiens.map((e, i) => (
                <tr>
                  <td align="center">{i + 1}</td>
                  <td align="left">
                    {listPhuongtien.find((f) => f.id == e.phuong_tien)?.ten}
                  </td>
                  <td align="center">{e.so_luong}</td>
                  <td align="center">
                    {nguoncap.find((f) => f.id == e.nguon_cap)?.ten}
                  </td>
                  <td align="center">{e.nam_cap}</td>
                  <td align="right">{VNDFormat(e.nguyen_gia)}</td>
                  <td align="right">{VNDFormat(e.nguyen_gia * e.so_luong)}</td>
                  <td>
                    <RiDeleteBin5Line
                      color="red"
                      onClick={() => delItem(e.id)}
                    />
                  </td>
                </tr>
              ))}
              <tr>
                <td align="center">...</td>
                <td>
                  <Filter
                    title="Chọn phương tiện"
                    name="phuong_tien"
                    target={phuongTienValues}
                    filters={listPhuongtien}
                    handleChange={handlePhuongTienValuesChange}
                    handleClick={(e) => {
                      // Cần code lại
                      const fetchData = async () => {
                        setListPhuongtien(
                          await (
                            await qlptApi.getListPhuongtien({ to_import: true })
                          ).data
                        );
                      };
                      fetchData();
                    }}
                  />
                  <BiAddToQueue
                    onClick={(e) => {
                      window.open(
                        "addPT",
                        "Thêm phương tiện mới",
                        "width=600,height=500"
                      );
                    }}
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    name="so_luong"
                    value={phuongTienValues.so_luong || ""}
                    onChange={handlePhuongTienValuesChange}
                  />
                </td>
                <td>
                  <Filter
                    title="Chọn nguồn cấp"
                    name="nguon_cap"
                    target={phuongTienValues}
                    filters={nguoncap}
                    handleChange={handlePhuongTienValuesChange}
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="text"
                    name="nam_cap"
                    value={phuongTienValues.nam_cap || ""}
                    onChange={handlePhuongTienValuesChange}
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    name="nguyen_gia"
                    value={phuongTienValues.nguyen_gia || ""}
                    onChange={handlePhuongTienValuesChange}
                  />
                </td>
                <td>
                  <input
                    className="form-control"
                    type="number"
                    name="thanh_tien"
                    value={phuongTienValues.thanh_tien || ""}
                    onChange={handlePhuongTienValuesChange}
                  />
                </td>
                <td>
                  <RiSave2Fill color="blue" onClick={handleSubSubmit} />
                </td>
              </tr>
            </table>
          </div>

          <br />
          <button className="form-control" type="submit">
            Lưu
          </button>
        </form>
      </div>
      <br />
    </main>
  );
};

export { FormNhapkho };
