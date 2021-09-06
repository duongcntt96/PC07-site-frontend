import avatar from "assets/images/avatar.jpg";
import React from "react";
import { Link } from "react-router-dom";
import { profiles } from "../data";

const Account = ({ show }) => {
  return (
    <div className={show ? "profile-submenu show" : "profile-submenu"}>
      <div className="profile-user-avatar">
        <img src={avatar} alt="avatar" />
      </div>

      {profiles.map((link) => {
        return (
          <div className="profile-submenu-content">
            <div className="profile-submenu-icons">{link.icon}</div>
            <div className="profile-submenu-links">{link.text}</div>
            <Link className="mask" to={link.url} key={link.id}></Link>
          </div>
        );
      })}
    </div>
  );
};

export default Account;
