import qlptApi from "api/qlptApi";
import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Filter from "features/Coso/components/Filter";
import { pushURL, VNDFormat } from "./Utils/DWUtils";
import { BiAddToQueue } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";

const Nhapkho = () => {
  const paramsURL = new URLSearchParams(window.location.search);
  const dispatch = useDispatch();

  const [filters, setValues] = useState({
    chung_loai: paramsURL.get("chung_loai"),
    kho_nhap: paramsURL.get("kho_nhap"),
    kho_xuat: paramsURL.get("kho_xuat"),
    nguon_cap: paramsURL.get("nguon_cap"),
    success: paramsURL.get("success") || true,
  });

  const [kho, setKho] = useState([]);
  const [listPhieunhap, setListPhieunhap] = useState([]);
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
      const list_PT = await qlptApi.getListPhieunhap({
        ...filters,
        size: 100,
      });
      setListPhieunhap(list_PT.data);
    };
    fetchData();
    pushURL(filters);
  }, [filters]);

  const handleChange = (e) => {
    setValues({ ...filters, [e.target.name]: e.target.value });
  };

  const delItem = async (ID) => {
    const result = await qlptApi.delPhieunhap(ID);
    if (result && result.status !== 400) {
      // alert("Xóa rồi");
      setValues({ ...filters, reload: !filters.reload });
    } else alert("Lỗi");
  };

  const tonggia = (phuong_tiens) => {
    let total = 0;
    phuong_tiens.map((e) => {
      total += e.so_luong * e.nguyen_gia;
    });
    return total;
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
          {listPhieunhap.length
            ? `Tìm thấy ${listPhieunhap.length} phiếu nhập kho.`
            : `Không có dữ liệu...`}
        </span>
      </h5>
      <br />
      {listPhieunhap.map((e, i) => {
        if (e.phuong_tiens.length || 1)
          return (
            <div>
              <span>
                Ngày <a href={`/qlpt/nhapkho/${e.id}`}>{e.thoi_gian}</a>,{" "}
              </span>
              <span>nhập {kho.find((f) => f.id === e.kho_nhap).ten}, </span>
              <span>
                {`từ `}
                {kho.find((f) => f.id === e.kho_xuat)?.ten ||
                  "nguồn kinh phí " +
                    nguoncap.find((f) => f.id === e.nguon_cap)?.ten}
              </span>
              <span>{e.note ? ` (${e.note})` : ""}</span>
              {!filters.success && (
                <RiDeleteBin5Line color="red" onClick={() => delItem(e.id)} />
              )}
              <p>Danh mục phương tiện:</p>
              <div className="alert alert-success">
                <table>
                  <tr>
                    <th style={{ width: "50px", textAlign: "center" }}>Stt</th>
                    <th style={{ width: "550px", textAlign: "center" }}>
                      Tên phương tiện
                    </th>
                    <th style={{ width: "90px", textAlign: "center" }}>
                      Số lượng
                    </th>
                    <th style={{ width: "150px", textAlign: "center" }}>
                      Nguồn cấp
                    </th>
                    <th style={{ width: "90px", textAlign: "center" }}>
                      Năm cấp
                    </th>
                    <th style={{ width: "120px", textAlign: "center" }}>
                      Nguyên giá
                    </th>
                    <th style={{ width: "140px", textAlign: "center" }}>
                      Thành tiền
                    </th>
                  </tr>
                  {e.phuong_tiens.map((e, i) => (
                    <tr key={e.id}>
                      <td align="center">{i + 1}</td>
                      <td align="left">{e.info.ten}</td>
                      <td align="center">{e.so_luong}</td>
                      <td align="center">{e.nguon_cap}</td>
                      <td align="center">{e.nam_cap}</td>
                      <td align="right">{VNDFormat(e.nguyen_gia)}</td>
                      <td align="right">
                        {VNDFormat(e.nguyen_gia * e.so_luong)}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                    <td>Tổng</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td style={{ color: "red" }} align="right">
                      {VNDFormat(tonggia(e.phuong_tiens))}
                    </td>
                  </tr>
                </table>
              </div>
              <br />
            </div>
          );
      })}
    </main>
  );
};

export { Nhapkho };
