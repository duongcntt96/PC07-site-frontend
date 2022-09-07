import qlptApi from "api/qlptApi";
import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Filter from "features/Coso/components/Filter";
import { pushURL, VNDFormat } from "./Utils/DWUtils";
import { BiAddToQueue } from "react-icons/bi";
import { useParams } from "react-router-dom";

const Phuongtien = () => {
  const paramsURL = new URLSearchParams(window.location.search);
  const dispatch = useDispatch();
  const [id, setID] = useState(useParams().id || paramsURL.get("id"));

  const [filters, setValues] = useState({
    chung_loai: paramsURL.get("chung_loai"),
    kho_nhap: paramsURL.get("kho_nhap"),
    kho_xuat: paramsURL.get("kho_xuat"),
    nguon_cap: paramsURL.get("nguon_cap"),
    success: paramsURL.get("success") || true,
  });

  const [PT_ifo, setPT_ifo] = useState({});
  const [chitietphieunhap, setChitietphieunhap] = useState([]);

  const [kho, setKho] = useState([]);
  const [nguoncap, setNguoncap] = useState([]);
  const [isTreeShowing, setIsTreeShowing] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setKho(await (await qlptApi.getListKho()).data);
      setNguoncap(await (await qlptApi.getListNguoncap()).data);
    };
    fetchData();
    pushURL(filters);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const PT_ifo = await qlptApi.getPhuongtien(id);
      setPT_ifo(PT_ifo);

      setChitietphieunhap(
        await (
          await qlptApi.getChitietPhieunhap({ phuong_tien: id })
        ).data
      );
    };
    fetchData();
    pushURL(filters);
  }, [filters]);

  const handleChange = (e) => {
    setValues({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <main onMouseOver={(e) => dispatch(closeSubMenu())}>
      <div>
        <a href="nhapkho/add">
          <BiAddToQueue />
          <span> Tạo phiếu mới</span>
        </a>
      </div>
      <div className="pt-header">
        <Filter
          title="Chọn kho xuất"
          name="kho_xuat"
          target={filters}
          filters={kho}
          handleChange={handleChange}
        />
        <Filter
          title="Chọn kho nhập"
          name="kho_nhap"
          target={filters}
          filters={kho}
          handleChange={handleChange}
        />
      </div>
      <div className="pt-header">
        <Filter
          title="Nguồn cấp"
          name="nguon_cap"
          target={filters}
          filters={nguoncap}
          handleChange={handleChange}
        />
        <Filter
          title="Trạng thái"
          name="success"
          target={filters}
          filters={[
            { id: true, ten: "Đã thực hiện" },
            { id: false, ten: "Chưa thực hiện" },
          ]}
          handleChange={handleChange}
        />
      </div>

      <h5>
        <span
          onClick={() => setIsTreeShowing(!isTreeShowing)}
          style={{ cursor: "pointer" }}
          className="unselectable"
        >
          Không có dữ liệu...
        </span>
      </h5>
      <br />

      <div>
        {PT_ifo && (
          <h3>
            {PT_ifo.ten} ({PT_ifo.totals})
          </h3>
        )}

        <table>
          <tr>
            <th style={{ width: "50px", textAlign: "center" }}>Stt</th>
            <th style={{ width: "90px", textAlign: "center" }}>Phiếu nhập</th>
            <th style={{ width: "90px", textAlign: "center" }}>Năm cấp</th>
            <th style={{ width: "90px", textAlign: "center" }}>Số lượng</th>
            <th style={{ width: "150px", textAlign: "center" }}>Nguồn cấp</th>
            <th style={{ width: "120px", textAlign: "center" }}>Nguyên giá</th>
            <th style={{ width: "140px", textAlign: "center" }}>Thành tiền</th>
          </tr>
          {chitietphieunhap.map((e, i) => (
            <tr key={e.id}>
              <td align="center">{i + 1}</td>
              <td align="center">{e.phieu_nhap}</td>
              <td align="center">{e.nam_cap}</td>
              <td align="center">{e.so_luong}</td>
              <td align="center">{e.nguon_cap}</td>
              <td align="right">{VNDFormat(e.nguyen_gia)}</td>
              <td align="right">{VNDFormat(e.nguyen_gia * e.so_luong)}</td>
            </tr>
          ))}
        </table>
      </div>
    </main>
  );
};

export { Phuongtien };
