import avatar from "assets/images/avatar-default.jpg";
import { decode } from "base-64";
import React, { useEffect, useState } from "react";
import { IoCaretDown, IoNotifications, IoPerson } from "react-icons/io5";
import { AiOutlineLogin, AiOutlineLogout  } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import Account from "./components/Account";
import {Stack, Button, Avatar, Typography} from '@mui/material'

const User = () => {
  const navigate = useNavigate();
  
  const [accessInfo, setAccessInfo] = useState({});
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("secret");
    if (token) {
      // console.log(token);
      const { access } = JSON.parse(token);
      if (access) {
        const accessInfo = JSON.parse(decode(access.split(".")[1]));
        console.log("get username success: ", accessInfo);
        setAccessInfo(accessInfo);
      }
    }
  }, []);

  const toggleProfile = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const logout = () => {
    localStorage.removeItem("secret");
    console.log("Đăng xuất thành công");
    navigate("/");
    window.location.reload();
  };

  if (accessInfo?.username)
  return (
      <Stack direction='row' spacing={2} alignItems='center' justifyContent="flex-end">
        <Avatar sx={{ width: 46, height: 46}} 
          src={accessInfo.avatar?(process.env.REACT_APP_API_URL.replace('/api','') + '/'+accessInfo.avatar):avatar}
          />
        <Link to="/user/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
        <Typography>
          {accessInfo.username}
        </Typography>
        </Link>
        <IoPerson />
        <IoNotifications />
        <AiOutlineLogout onClick={() => logout()} title="Đăng xuất"/>
        {/* <IoCaretDown onClick={() => toggleProfile()} /> */}
        {/* <Account show={isProfileMenuOpen} username={accessInfo.username} /> */}
      </Stack>
      )
   return (<Stack onClick={() => navigate("/user/login")} sx={{cursor: "pointer"}} direction='row' spacing={2} alignItems='center' justifyContent="flex-end">
    <Avatar sx={{ width: 46, height: 46}} src={avatar}/>
    <Typography>
      Đăng nhập
    </Typography>   
    <AiOutlineLogin title="Đăng nhập"/>
   </Stack>
)
  };

export default User;
