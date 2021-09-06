import userApi from "api/userApi";
import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

const login = async ({ username, password }) => {
  const response = await userApi.login({ username, password });
  localStorage.setItem("secret", JSON.stringify(response));
  // console.log(JSON.stringify(response));
  if (response.status) return;
  else {
    // check redirect url exist
    const query = new URLSearchParams(window.location.search);
    const url = query.get("url") || "/profile";
    // redirect
    window.location.replace(url);
  }
};
const logout = () => {
  localStorage.removeItem("secret");
  console.log("Đăng xuất thành công");
  window.location.reload();
};

const Login = () => {
  const dispatch = useDispatch();

  const [values, setValues] = useState({});

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    login(values);
  };

  return (
    <div
      className="main-container"
      onMouseOver={(e) => dispatch(closeSubMenu())}
    >
      <main className="alert alert-secondary" role="alert">
        <div className="row">
          <div className="col">
            <div className="about">
              <h1>Login</h1>
              This is a light alert—check it out!
              <button className="btn" onClick={() => login()}>
                ĐĂNG NHẬP
              </button>
              <button className="btn" onClick={() => logout()}>
                ĐĂNG XUẤT
              </button>
            </div>
          </div>
          <div className="col">
            <div className="modal-container">
              <form
                onSubmit={(e) => {
                  handleSubmit(e);
                }}
              >
                <label>Tên đăng nhập</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  placeholder="Username"
                  onChange={(e) => handleChange(e)}
                />
                <br />
                <label>Mật khẩu</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Password"
                  onChange={(e) => handleChange(e)}
                />
                <br />
                <button className="btn" type="submit">
                  ĐĂNG NHẬP
                </button>
                <span> Chưa có tài khoản ? </span>
                <a href="/signup">Đăng kí</a>
                <span> Quên mật khẩu?</span>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export { Login };
