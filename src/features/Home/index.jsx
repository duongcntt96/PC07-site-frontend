import axiosClient from "api/axiosClient";
import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";

const login = async (username, password) => {
  const url = "/token/";
  const response = await axiosClient.post(url, { username, password });
  localStorage.setItem("secret", JSON.stringify(response));
  console.log(JSON.stringify(response));
};
const logout = () => {
  localStorage.removeItem("secret");
  alert("Đăng xuất thành công");
};

const Home = () => {
  const [username, setUser] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  return (
    <div
      className="main-container"
      onMouseOver={(e) => dispatch(closeSubMenu())}
    >
      <main className="alert alert-secondary" role="alert">
        <div className="row">
          <div className="col">
            <div className="about">
              <h1>Home</h1>
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log("Login");
                login(username, password);
                setUser("");
                setPassword("");
              }}
            >
              <input
                type="text"
                name="username"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUser(e.target.value)}
              />

              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className="btn">ĐĂNG NHẬP</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
