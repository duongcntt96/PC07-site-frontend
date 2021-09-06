import userApi from "api/userApi";
import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

const register = async ({ username, password, email }) => {
  const respone = await userApi.register({ username, password, email });
  if (respone.status) return;
  alert("Register successfully!");
};

const Register = () => {
  const dispatch = useDispatch();
  const [values, setValues] = useState({});

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register(values);
  };

  return (
    <main onMouseOver={(e) => dispatch(closeSubMenu())}>
      <div className="row">
        <div className="col-sm-7">
          <div className="about">
            <h3>Đã có tài khoản ?</h3>
            <button className="btn">ĐĂNG KÝ</button>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore
              nostrum eveniet quos architecto vitae, expedita temporibus
              voluptas enim iusto pariatur consectetur totam corporis libero
              tempora, dolorum magnam voluptatibus accusantium quasi. Pariatur,
              quod officia animi repellat minima veritatis illum, eum
              consequatur molestias asperiores aliquam neque mollitia suscipit
              eveniet fugit, dolorum eius explicabo adipisci impedit ducimus
              reiciendis? Quidem suscipit voluptatem iusto sapiente sequi
              quisquam sunt nesciunt consequatur, blanditiis, modi minima. Magni
              iure dolor facilis magnam! Perferendis, id? Illum, quasi facilis?
              Placeat inventore eos ad! Sint ad eum perspiciatis voluptates
              illum a voluptate, asperiores quis provident tenetur consequatur
              adipisci, et at obcaecati. Corporis?
            </p>
          </div>
        </div>

        <div className="col-sm-5">
          <form action="" className="form" onSubmit={handleSubmit}>
            <input
              name="username"
              onChange={(e) => handleChange(e)}
              className="form-control"
              type="text"
              placeholder="Tên đăng nhập"
            />
            <input
              name="fullname"
              onChange={(e) => handleChange(e)}
              className="form-control"
              type="text"
              placeholder="Họ và tên"
            />
            <input
              name="email"
              onChange={(e) => handleChange(e)}
              className="form-control"
              type="text"
              placeholder="Email"
            />
            <input
              name="password"
              onChange={(e) => handleChange(e)}
              className="form-control"
              type="password"
              placeholder="Mật khẩu"
            />
            <button className="btn -green" type="submit">
              ĐĂNG KÝ
            </button>
            <p>Quên mật khẩu?</p>
            <button className="btn">ĐĂNG NHẬP</button>
          </form>
        </div>
      </div>
    </main>
  );
};

export { Register };
