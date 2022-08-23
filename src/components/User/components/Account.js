import avatar from "assets/images/avatar-default.jpg";
import React from "react";
import { GoSignIn } from "react-icons/go";
import { Link, useHistory } from "react-router-dom";
import { profiles } from "../data";

const Account = ({ show, username }) => {
  const history = useHistory();

  const logout = () => {
    localStorage.removeItem("secret");
    console.log("Đăng xuất thành công");
    history.push("/home");
    window.location.reload();
  };

  return (
    <div className={show ? "profile-submenu show" : "profile-submenu"}>
      <div className="profile-user-avatar">
        <img src={avatar} alt="avatar" />
      </div>

      {profiles.map((link, index) => {
        const { id, url, text, icon } = link;
        return (
          <div key={index} className="profile-submenu-content">
            <div className="profile-submenu-icons">{icon}</div>
            <div className="profile-submenu-links">{text}</div>
            <Link className="mask" to={url} key={id}></Link>
          </div>
        );
      })}

      <div className="profile-submenu-content">
        <div className="profile-submenu-icons">
          <GoSignIn />
        </div>
        {username ? (
          <>
            <div className="profile-submenu-links">Đăng xuất</div>
            <div className="mask" onClick={() => logout()}></div>
          </>
        ) : (
          <>
            <div className="profile-submenu-links">Đăng nhập</div>
            <div
              className="mask"
              onClick={() => history.push("/user/login")}
            ></div>
          </>
        )}
      </div>
    </div>
  );
};

export default Account;
