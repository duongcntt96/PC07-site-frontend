import User from "components/User";
import React, { useState } from "react";
import logo from "../../assets/images/logo.png";
import { links } from "../../data";
import { Link } from "react-router-dom";
import {AppBar, Toolbar, Stack,Paper} from '@mui/material'
import Submenu from "./Submenu";

export default function Navbar() {
  const [isHovered, setIsHovered] = useState(false);

  const imageStyle = {
    height: '80px', // Khuyên dùng px thay vì vh cho logo để ổn định layout
    cursor: 'pointer',
    transition: 'transform 0.3s ease-in-out', // Hiệu ứng mượt mà kiểu MUI
    transform: isHovered ? 'scale(1.2)' : 'scale(1)', // Phóng to 20% khi hover
  };

  return (
    <>
      <AppBar position='sticky' sx={{ p:2 }} >
        <Toolbar variant="dense">
          <Link to="/">
            <img src={logo} alt="logo" height='80vh' onMouseOver={(e) => e.target.style.transform = "scale(1.1)"} onMouseOut={(e) => e.target.style.transform = "scale(1)"} />
          </Link>
          <Stack
            direction='row'
            justifyContent='center'
            alignItems='center'
            spacing={1}
            sx={{ flexGrow: 1}}>
            {links.map((link) => {
              return (link.active&&
                <Submenu key={link.id} {...link}/>
              );
            })}
          </Stack>
          <User />
        </Toolbar>
      </AppBar>
    </>
  );
};
