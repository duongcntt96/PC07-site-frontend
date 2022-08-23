import userApi from "api/userApi";
import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";

import { BiError } from "react-icons/bi";

const Register = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [values, setValues] = useState({});
  const [error, setError] = useState({});

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    register(values);
  };

  const register = async ({ username, first_name, password, email }) => {
    userApi
      .register({ username, first_name, password, email })
      .then((response) => {
        // handle success
        response = response.data;
        localStorage.setItem("secret", JSON.stringify(response));
        if (response.status) return;
        else {
          // check redirect url exist
          const query = new URLSearchParams(window.location.search);
          const url = query.get("url") || "/profile";
          // redirect
          window.location.replace(url);
        }
      })
      .catch((e) => {
        console.log("====================================");
        console.log(e.response.data);
        console.log("====================================");
        setError(e.response.data);
      });
  };

  return (
    <main
      onMouseOver={(e) => dispatch(closeSubMenu())}
      style={{
        backgroundImage: `url("https://akm-img-a-in.tosshub.com/indiatoday/images/story/202005/international_firefighters_day.jpeg")`,
      }}
    >
      <div className="row">
        <div className="col-sm-6"></div>

        <div className="col-sm-5">
          <form action="" className="form" onSubmit={handleSubmit}>
            <input
              id="username"
              name="username"
              onChange={(e) => handleChange(e)}
              className="form-control"
              type="text"
              placeholder="Tên đăng nhập"
              required
            />
            {error.username && (
              <>
                <span style={{ color: "red" }}>
                  <BiError
                    style={{
                      transform: "translateY(5px)",
                      width: "25px",
                      height: "25px",
                    }}
                  />
                  {error.username}
                </span>
              </>
            )}
            <input
              name="first_name"
              onChange={(e) => handleChange(e)}
              className="form-control"
              type="text"
              placeholder="Họ và tên"
              required
            />
            {error.first_name && (
              <span style={{ color: "red" }}>
                <BiError
                  style={{
                    transform: "translateY(5px)",
                    width: "25px",
                    height: "25px",
                  }}
                />
                {error.first_name}
              </span>
            )}
            <input
              name="email"
              onChange={(e) => handleChange(e)}
              className="form-control"
              type="email"
              placeholder="Email"
              required
            />
            {error.email && (
              <span style={{ color: "red" }}>
                <BiError
                  style={{
                    transform: "translateY(5px)",
                    width: "25px",
                    height: "25px",
                  }}
                />
                {error.email}
              </span>
            )}
            <input
              name="password"
              onChange={(e) => handleChange(e)}
              className="form-control"
              type="password"
              placeholder="Mật khẩu"
              required
            />
            {error.password && (
              <span style={{ color: "red" }}>
                <BiError
                  style={{
                    transform: "translateY(5px)",
                    width: "25px",
                    height: "25px",
                  }}
                />
                {error.password}
              </span>
            )}

            <button className="btn -green" type="submit">
              TẠO TÀI KHOẢN
            </button>
            <span>Đã có tài khoản?</span>
            <button className="btn" onClick={() => history.push("/user/login")}>
              ĐĂNG NHẬP
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export { Register };
