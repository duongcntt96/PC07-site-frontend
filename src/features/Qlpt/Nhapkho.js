import qlptApi from "api/qlptApi";
import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Filter from "features/Coso/components/Filter";
import { pushURL, VNDFormat } from "./Utils/DWUtils";
import { BiAddToQueue } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { ImArrowRight } from "react-icons/im";
import Loading from "components/Loading";

const Nhapkho = () => {
  const paramsURL = new URLSearchParams(window.location.search);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const [filters, setValues] = useState({
    chung_loai: paramsURL.get("chung_loai"),
    kho_nhap: paramsURL.get("kho_nhap"),
    kho_xuat: paramsURL.get("kho_xuat"),
    nguon_cap: paramsURL.get("nguon_cap"),
    success: paramsURL.get("success") || true,
    thoi_gian__start: paramsURL.get("thoi_gian__start"),
    thoi_gian__end: paramsURL.get("thoi_gian__end"),
    chi_tiet_phieu_nhap__phuong_tien: paramsURL.get(
      "chi_tiet_phieu_nhap__phuong_tien"
    ),
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
    setLoading(true);
    fetchData();
    pushURL(filters);
    setLoading(false);
  }, []);

  useEffect(() => {
    let timer;
    const fetchData = async () => {
      setLoading(true);
      const list_PT = await qlptApi.getListPhieunhap({
        ...filters,
        size: 100,
      });
      setListPhieunhap(list_PT.data);
      pushURL(filters);
      setLoading(false);
    };
    timer = setTimeout(fetchData, 300);
    return () => {
      clearTimeout(timer);
    };
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
        <input
          className="form-control"
          type="date"
          name="thoi_gian__start"
          value={filters.thoi_gian__start}
          onChange={handleChange}
        />
        <input
          className="form-control"
          type="date"
          name="thoi_gian__end"
          value={filters.thoi_gian__end}
          onChange={handleChange}
        />
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
          {loading ? (
            <Loading />
          ) : (
            `Tìm thấy ${listPhieunhap.length} phiếu nhập ${
              filters.kho_xuat &&
              " từ " + kho.find((e) => e.id == filters.kho_xuat)?.ten
            }${
              filters.kho_nhap &&
              " vào " + kho.find((e) => e.id == filters.kho_nhap)?.ten
            }`
          )}
        </span>
      </h5>
      <br />
      {listPhieunhap.map((e, i) => {
        if (e.phuong_tiens.length || 1)
          return (
            <div>
              <h6>
                <span>
                  Ngày{" "}
                  <a href={`/qlpt/nhapkho/${e.id}`}>
                    {e.thoi_gian.slice(8, 10)}/{e.thoi_gian.slice(5, 7)}/
                    {e.thoi_gian.slice(0, 4)}:
                  </a>
                </span>
                <span> {kho.find((f) => f.id === e.kho_xuat)?.ten} </span>
                <ImArrowRight
                  style={{ transform: "translateY(2px)", opacity: "70%" }}
                />
                <span> {kho.find((f) => f.id === e.kho_nhap).ten} </span>
                <span>{e.note && ` (${e.note})`}</span>
              </h6>
              {!filters.success && (
                <RiDeleteBin5Line color="red" onClick={() => delItem(e.id)} />
              )}
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
                      <td
                        align="left"
                        style={{
                          color:
                            filters.chi_tiet_phieu_nhap__phuong_tien ==
                              e.info.id && "red",
                        }}
                      >
                        {e.info.ten}
                      </td>
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
