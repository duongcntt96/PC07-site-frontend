import chungloaiApi from "api/chungloaiApi";
import phuongtienApi from "api/phuongtienApi";
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "./modalSlice";

const Modal = () => {
  const dispatch = useDispatch();
  const { isShowing, data } = useSelector((state) => state.modal);

  const [values, setValues] = useState({});

  const [chungloaiList, setChungloaiList] = useState([]);

  useEffect(() => {
    const getChungloaiList = async () => {
      const rp = await chungloaiApi.getAll();
      console.log(rp.data);
      if (rp.status) return;
      setChungloaiList(rp.data);
    };
    getChungloaiList();
  }, []);

  const add = async () => {
    if (!data.id) {
      alert("Lỗi");
      return;
    }
    const respone = await phuongtienApi.addChild({
      ...values,
      noi_bo_tri: data.id,
    });
    if (respone.status) {
      alert("Lỗi " + respone.statusText);
      return;
    }
    dispatch(closeModal());
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    add();
  };
  return (
    <div className={isShowing ? "modal-overlay show-modal" : "modal-overlay"}>
      <div className="modal-container">
        <form onSubmit={(e) => handleSubmit(e)}>
          <label>Tên</label>
          <input
            type="text"
            className="form-control"
            name="ten"
            placeholder="Tên phương tiện"
            onChange={(e) => handleChange(e)}
          />

          <label>Chủng loại</label>
          <select
            onFocus={(e) => (e.target.size = 5)}
            onBlur={(e) => (e.target.size = 1)}
            className="form-control"
            name="chung_loai"
            onChange={(e) => {
              handleChange(e);
              e.target.size = 1;
              e.target.blur();
            }}
          >
            <option>Select</option>
            {chungloaiList.map((item) => {
              return (
                <option key={item.id} value={item.id}>
                  {item.ten}
                </option>
              );
            })}
          </select>

          <label>Discription</label>
          <textarea className="form-control"></textarea>

          <button className="btn" type="submit">
            Lưu
          </button>
        </form>

        <button
          className="close-modal-btn"
          onClick={() => {
            const action = closeModal();
            dispatch(action);
          }}
        >
          <FaTimes></FaTimes>
        </button>
      </div>
    </div>
  );
};

export default Modal;
