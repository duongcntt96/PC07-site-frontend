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
    } else alert("L???i");
    setID(id2);
  };
  // Push request
  const delItem = async (ID) => {
    const id2 = id;
    setID(null);
    const result = await qlptApi.delChitietPhieunhap(ID);
    if (result && result.status !== 400) {
      // alert("X??a r???i");
    } else alert("L???i");
    setID(id2);
  };

  return (
    <main onMouseOver={(e) => dispatch(closeSubMenu())}>
      <div>
        <h5>{id ? "Ch???nh s???a phi???u nh???p" : "Nh???p ph????ng ti???n"}</h5>
        <form onSubmit={handleSubmit}>
          <div>
            <label>L?? do nh???p: </label>
            <input
              className="form-control"
              type="text"
              name="note"
              placeholder="B??? C??ng an c???p/T??? mua s???m/Thu h???i/..."
              value={formValues.note}
              onChange={handleFormValuesChange}
            />
          </div>

          <div>
            <label>Ng??y th??ng nh???p/xu???t: </label>
            <input
              className="form-control"
              type="date"
              name="thoi_gian"
              value={formValues.thoi_gian}
              onChange={handleFormValuesChange}
            />
          </div>

          <div>
            <label>Xu???t t??? kho: </label>
            <Filter
              title="Ch???n kho xu???t"
              name="kho_xuat"
              target={formValues}
              filters={kho}
              handleChange={handleFormValuesChange}
            />
          </div>
          <div>
            <label>Nh???p v??o kho: </label>
            <Filter
              title="Ch???n kho nh???p"
              name="kho_nhap"
              target={formValues}
              filters={kho}
              handleChange={handleFormValuesChange}
            />
          </div>
          <div>
            <span>???? th???c hi???n: </span>
            <input
              type="radio"
              name="success"
              checked={formValues.success}
              onClick={handleFormValuesChange}
            />
          </div>

          <p>Danh m???c ph????ng ti???n:</p>
          <div className="alert alert-success">
            <table>
              <tr>
                <th style={{ width: "50px", textAlign: "center" }}>Stt</th>
                <th style={{ width: "450px", textAlign: "center" }}>
                  T??n ph????ng ti???n
                </th>
                <th style={{ width: "90px", textAlign: "center" }}>S??? l?????ng</th>
                <th style={{ width: "150px", textAlign: "center" }}>
                  Ngu???n c???p
                </th>
                <th style={{ width: "90px", textAlign: "center" }}>N??m c???p</th>
                <th style={{ width: "120px", textAlign: "center" }}>
                  Nguy??n gi??
                </th>
                <th style={{ width: "120px", textAlign: "center" }}>
                  Th??nh ti???n
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
                    title="Ch???n ph????ng ti???n"
                    name="phuong_tien"
                    target={phuongTienValues}
                    filters={listPhuongtien}
                    handleChange={handlePhuongTienValuesChange}
                    handleClick={(e) => {
                      // C???n code l???i
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
                        "Th??m ph????ng ti???n m???i",
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
                    title="Ch???n ngu???n c???p"
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
            L??u
          </button>
        </form>
      </div>
      <br />
    </main>
  );
};

export { FormNhapkho };
