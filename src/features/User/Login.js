import userApi from "api/userApi";
import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";

const Login = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [values, setValues] = useState({});

  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    login(values);
  };

  const login = async ({ username, password }) => {
    userApi
      .login({ username, password })
      .then(function (response) {
        // handle success
        response = response.data;
        localStorage.setItem("secret", JSON.stringify(response));
        if (response.status) return;
        else {
          // check redirect url exist
          const query = new URLSearchParams(window.location.search);
          const url = query.get("url") || "profile";
          // redirect
          window.location.replace(url);
        }
      })
      .catch(function (error) {
        const status = error.response.status;
        if (status === 400) setError("Vui lòng nhập đầy đủ thông tin!");
        if (status === 401) setError("Tài khoản không đúng!");
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
        <div className="col-sm-7"></div>

        <div className="col-sm-4">
          <form
            style={{ marginTop: "80px", height: "360px" }}
            className="form"
            onSubmit={(e) => {
              handleSubmit(e);
            }}
          >
            <input
              type="text"
              className="form-control"
              name="username"
              placeholder="Username"
              onChange={(e) => handleChange(e)}
              required
            />
            <br />
            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="Password"
              onChange={(e) => handleChange(e)}
              required
            />
            <br />

            {error && <p className="alert alert-danger">{error}</p>}
            <button className="btn -green" type="submit">
              ĐĂNG NHẬP
            </button>
            <p>Quên mật khẩu?</p>
            <button
              className="btn"
              onClick={() => history.push("/user/register")}
            >
              ĐĂNG KÝ
            </button>
          </form>
        </div>
      </div>
    </main>
  );
};

export { Login };
