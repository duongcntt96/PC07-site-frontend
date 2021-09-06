import { decode } from "base-64";
import React, { useEffect, useState } from "react";
import { IoPerson, IoCaretDown, IoNotifications } from "react-icons/io5";

import "assets/styles/style.scss";

import avatar from "assets/images/avatar.jpg";
import Account from "./components/Account";

const User = () => {
  const [username, setUsername] = useState("");
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
    <div className="nav-profile-container">
      <img className="avatar" src={avatar} alt="avatar" />
      <span>{username}</span>
      <div>
        <div className="toolbar">
          <IoPerson />
          <IoNotifications />
          <IoCaretDown onClick={() => toggleProfile()} />
        </div>
        <Account show={isProfileMenuOpen} />
      </div>
    </div>
  );
};

export default User;
