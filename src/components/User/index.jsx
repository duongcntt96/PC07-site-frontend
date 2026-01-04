import avatar from "assets/images/avatar-default.jpg";
import { decode } from "base-64";
import React, { useEffect, useState } from "react";
import { IoCaretDown, IoNotifications, IoPerson } from "react-icons/io5";
import { GoSignIn } from "react-icons/go";
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
      <Stack direction='row' spacing={2} alignItems='center'>
        <Avatar sx={{ width: 76, height: 76}} src={accessInfo.avatar?(process.env.REACT_APP_API_URL.replace('/api','') + '/'+accessInfo.avatar):avatar} />
        <Typography>
          {accessInfo.username}
        </Typography>
        <IoPerson />
        <IoNotifications />
        
        <Button startIcon={<GoSignIn />} onClick={() => logout()} color='warning'/>
        {/* <IoCaretDown onClick={() => toggleProfile()} /> */}
        {/* <Account show={isProfileMenuOpen} username={accessInfo.username} /> */}
      </Stack>
      )
   return (
   <Stack direction='row' spacing={2} alignItems='center' sx={{width: 200}}>
    <Avatar sx={{ width: 76, height: 76}}  src={avatar} alt="avatar"/>
      <Link to="/user/login">
        Đăng nhập
      </Link>
    </Stack>
    )
  };

export default User;
