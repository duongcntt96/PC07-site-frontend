import qlptApi from "api/qlptApi";
import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Filter from "features/Coso/components/Filter";
import { pushURL, VNDFormat } from "./Utils/DWUtils";
import { useParams } from "react-router-dom";
import { RiDeleteBin5Line, RiSave2Fill } from "react-icons/ri";

const FormAddPhuongTien = () => {
  const dispatch = useDispatch();
  const [id, setID] = useState(useParams().id);

  const [formValues, setFormValues] = useState({
    phuong_tiens: [],
    success: false,
  });

  const [listPhuongtien, setListPhuongtien] = useState([]);
  const [kho, setKho] = useState([]);
  const [nguoncap, setNguoncap] = useState([]);
  const [chungloai, setChungloai] = useState([]);

  // get const data list
  useEffect(() => {
    const fetchData = async () => {
      setListPhuongtien(await qlptApi.getListPhuongtien());
      setKho(await (await qlptApi.getListKho()).data);
      setNguoncap(await (await qlptApi.getListNguoncap()).data);
      setChungloai(await (await qlptApi.getListChungloai()).data);
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

  // Update input data
  const handleFormValuesChange = (e) => {
    if (e.target.type === "radio") {
      setFormValues({
        ...formValues,
        [e.target.name]: !formValues[e.target.name],
      });
    } else setFormValues({ ...formValues, [e.target.name]: e.target.value });
  };

  // Push request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) {
      const result = await qlptApi.updatePhuongtien({ ...formValues, id: id });
    } else {
      const result = await qlptApi.addPhuongtien({ ...formValues });
      window.close();
    }
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
            <label>Tên phương tiện: </label>
            <input
              className="form-control"
              type="text"
              name="ten"
              placeholder="Mặt nạ phòng độc cách ly Drager/..."
              onChange={handleFormValuesChange}
            />
          </div>

          <div>
            <label>Chủng loại: </label>
            <Filter
              title="Chọn chủng loại"
              name="chung_loai"
              target={formValues}
              filters={chungloai}
              handleChange={handleFormValuesChange}
            />
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

export { FormAddPhuongTien };
