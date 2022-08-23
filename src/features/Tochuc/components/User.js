import userApi from "api/userApi";
import React, { useState, useEffect } from "react";
import { groups } from "../data";
import avatar from "assets/images/avatar-default.jpg";

const User = ({ id }) => {
  const [user, setUser] = useState({
    id: 34,
    password:
      "pbkdf2_sha256$260000$kRt973cHkVlRz4u8dPvVzy$gjoM/aixVVFLMcVbcY8pGqp/DaOZ0vHx2dDXllg/ME8=",
    last_login: "2021-09-28T23:50:45Z",
    is_superuser: true,
    username: "duongcntt96",
    first_name: "",
    last_name: "",
    email: "duong.ht96@gmail.com",
    is_staff: true,
    is_active: true,
    date_joined: "2021-09-28T23:50:32Z",
    groups: [1, 2, 3, 6, 5],
    user_permissions: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const rp = await userApi.getUser(id);
      setUser(rp);
    };
    fetchData();
  }, [id]);

  return (
    <div
      className="user-item"
      onClick={() => {
        window.open(`/tochuc/person/${id}`);
      }}
    >
      <div className="profile-user-avatar">
        <img src={avatar} alt="avatar" />
      </div>
      <h6>
        {user.first_name} (@{user.username})
      </h6>
      <p>
        Chức vụ:
        {groups.map((item) => {
          if (user.groups.includes(item.id)) {
            return <span key={item.id}> {item.name}</span>;
          }
        })}
      </p>
    </div>
  );
};

export default User;
