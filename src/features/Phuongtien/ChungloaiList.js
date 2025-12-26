import chungloaiApi from "api/chungloaiApi";
import phuongtienApi from "api/phuongtienApi";
import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { PhuongtienList } from ".";

const ChungloaiList = () => {
  const dispatch = useDispatch();

  const params = new URLSearchParams(window.location.search);

  const [chungLoai, setChungLoai] = useState(
    params.has("chung_loai") ? [{ id: params.get("chung_loai") }] : []
  );

  const [values, setValues] = useState({
    chung_loai: params.get("chung_loai"),
    quan_ly: params.get("quan_ly"),
    trang_thai: params.get("trang_thai"),
    chat_luong: params.get("chat_luong"),
  });

  const [to, setTo] = useState([]);
  const [trangthai, setTrangthai] = useState([]);
  const [chatluong, setChatluong] = useState([]);

  useEffect(() => {
    const params = { size: 100 };
    const fetchData = async () => {
      if (!chungLoai.length) {
        const rp = await chungloaiApi.getAll(params);
        setChungLoai(rp.data);
      }
      const { data: chatluong } = await phuongtienApi.getListChatLuong();
      const { data: trangthai } = await phuongtienApi.getListTrangThai();
      const { data: to } = await phuongtienApi.getListTo();
      setChatluong(chatluong);
      setTrangthai(trangthai);
      setTo(to);
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  return (
    <main onMouseOver={(e) => dispatch(closeSubMenu())}>
      <div className="pt-header">
        <div className="filter-item">
          <select
            className="form-control"
            name="quan_ly"
            value={values.quan_ly}
            onChange={(e) => {
              handleChange(e);
            }}
          >
            <option value="">Tất cả</option>
            {to.map((item) => (
              <option value={item.id}>{item.name}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <select
            className="form-control"
            name="trang_thai"
            value={values.trang_thai}
            onChange={(e) => {
              handleChange(e);
            }}
          >
            <option value="">Tất cả</option>
            {trangthai.map((item) => (
              <option value={item.id}>{item.trang_thai}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <select
            className="form-control"
            name="chat_luong"
            value={values.chat_luong}
            onChange={(e) => {
              handleChange(e);
            }}
          >
            <option value="">Tất cả</option>
            {chatluong.map((item) => (
              <option value={item.id}>{item.chat_luong}</option>
            ))}
          </select>
        </div>
      </div>

      {chungLoai.map((item) => {
        return <PhuongtienList key={item.id} data={item} filter={values} />;
      })}
    </main>
  );
};

export { ChungloaiList };
