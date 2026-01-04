import User from "components/User";
import React, { useState } from "react";
import logo from "../../assets/images/logo.png";
import { links } from "../../data";
import { Link } from "react-router-dom";
import {AppBar, Toolbar, Stack,Paper} from '@mui/material'
import Submenu from "./Submenu";

export default function Navbar() {

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
