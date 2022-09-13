import userApi from "api/userApi";
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import avatar from "assets/images/avatar-default.jpg";
import { useDispatch } from "react-redux";
import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import { decode } from "base-64";

const Profile = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("secret");
      if (token) {
        // console.log(token);
        const { access } = JSON.parse(token);
        if (access) {
          const accessInfo = JSON.parse(decode(access.split(".")[1]));
          // console.log("get username success", accessInfo.name);
          const id = accessInfo.user_id;
          const rp = await userApi.getUserProfile(id);
          setUser(rp);
        }
      }
    };
    fetchData();
  }, []);

  const {
    username,
    ten,
    ngay_sinh,
    que_quan,
    ho_khau,
    sdt,
    trinh_do_hoc_van,
    trinh_do_chuyen_mon,
    cap_bac,
    ngay_vao_nganh,
  } = user;
  return (
    <main onMouseOver={(e) => dispatch(closeSubMenu())}>
      <Helmet>
        <title>{`${ten} - Thông tin cá nhân !`}</title>
      </Helmet>
      <div className="row">
        <div className="col-md-3 border-right">
          <div className="d-flex flex-column align-items-center text-center p-3 py-5">
            <img src={avatar} alt="avatar" style={{ borderRadius: "50%" }} />
            <span className="text-black-50">{cap_bac}</span>
            <span className="font-weight-bold">{ten}</span>

            <span>{ngay_vao_nganh}</span>
          </div>
        </div>

        <div className="col-md-5 border-right">
          <div className="p-3 py-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="text-right">Thông tin cá nhân</h4>
            </div>
            <div className="row mt-2">
              <div className="col-md-12">
                <label className="labels">Họ và tên</label>
                <input className="form-control" name="ten" value={ten} />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-6">
                <label className="labels">Ngày sinh</label>
                <input className="form-control" value={ngay_sinh} />
              </div>
              <div className="col-md-6">
                <label className="labels">Số điện thoại</label>
                <input className="form-control" value={sdt} />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-12">
                <label className="labels">Quê quán</label>
                <input className="form-control" value={que_quan} />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-12">
                <label className="labels">Hộ khẩu thường trú</label>
                <input className="form-control" value={ho_khau} />
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="p-3 py-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="text-right">Trình độ, sở trường</h4>
            </div>
            <div className="col-md-12">
              <label className="labels">Trình độ học vấn</label>
              <input className="form-control" value={trinh_do_hoc_van} />
            </div>
            <div className="col-md-12">
              <label className="labels">Trình độ chuyên môn</label>
              <input className="form-control" value={trinh_do_chuyen_mon} />
            </div>
            <div className="col-md-12">
              <label className="labels">Chuyên ngành đào tạo</label>
              <input className="form-control" value={trinh_do_chuyen_mon} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;
