import avatar from "assets/images/avatar-default.jpg";
import "assets/styles/style.scss";
import { decode } from "base-64";
import React, { useEffect, useState } from "react";
import { IoCaretDown, IoNotifications, IoPerson } from "react-icons/io5";
import { Link } from "react-router-dom";
import Account from "./components/Account";

const User = () => {
  const [username, setUsername] = useState(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("secret");
    if (token) {
      // console.log(token);
      const { access } = JSON.parse(token);
      if (access) {
        const accessInfo = JSON.parse(decode(access.split(".")[1]));
        // console.log("get username success", accessInfo.name);
        setUsername(accessInfo.name);
      }
    }
  }, []);

  const toggleProfile = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <>
      {username ? (
        <div className="nav-profile-container">
          <img className="avatar" src={avatar} alt="avatar" />
          <span>{username}</span>
          <div>
            <div className="toolbar">
              <IoPerson />
              <IoNotifications />
              <IoCaretDown onClick={() => toggleProfile()} />
            </div>
            <Account show={isProfileMenuOpen} username={username} />
          </div>
        </div>
      ) : (
        <div>
          <img className="avatar" src={avatar} alt="avatar" />
          <Link className="btn-login" to="/user/login">
            Đăng nhập
          </Link>
        </div>
      )}
    </>
  );
};

export default User;
