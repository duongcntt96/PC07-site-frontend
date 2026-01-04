import React, { useState } from "react";
import logo from "../../assets/images/logo.png";
import { links } from "../../data";
import { Link } from "react-router-dom";
import {AppBar, Toolbar, Stack,Box, IconButton, Drawer, List, ListItem, ListItemText, ListItemIcon} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'; // Import MenuIcon
import Submenu from "./Submenu";
import User from "components/User";



import { ListItemButton, Collapse, Divider } from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';


const renderMenuItems = (link, handleDrawerClose, depth = 0) => {
  const hasChildren = link.children && link.children.length > 0;

  return (
    link.active && (
      <React.Fragment key={link.id}>
        <ListItem button component={Link} to={link.url} onClick={handleDrawerClose} sx={{ pl: 2 + depth * 2 }}>
          {link.icon && <ListItemIcon sx={{ color: 'inherit' }}>{link.icon}</ListItemIcon>}
          <ListItemText primary={link.text} />
        </ListItem>
        {hasChildren && (
          <List component="div" disablePadding>
            {link.children.map((childLink) =>
              renderMenuItems(childLink, handleDrawerClose, depth + 1)
            )}
          </List>
        )}
      </React.Fragment>
    )
  );
};

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };


  const navigate = useNavigate();
  const [openStates, setOpenStates] = useState({});
  // Xử lý đóng mở menu con
  const handleToggle = (id) => {
    setOpenStates(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleNavigate = (url) => {
    navigate(url);
    handleDrawerClose();
  };

  return (
    <>
      <AppBar position='sticky' sx={{ p:2 }} >
        <Toolbar variant="dense" sx={{ justifyContent: 'space-between', flexDirection: 'row' }}>
          <Stack direction="row" alignItems="center" spacing={1}> {/* Group hamburger and logo */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { sm: 'none' } }} // Only show on extra small screens
            >
              <MenuIcon />
            </IconButton>

            <Link to="/">
              <Box
                component="img"
                src={logo}
                alt="logo"
                sx={{
                  height: '80px',
                  transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
              />
            </Link>
          </Stack>

          {/* Main Navigation Links for larger screens */}
          <Stack
            direction='row'
            justifyContent='center'
            alignItems='center'
            spacing={1}
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'flex' } }}> {/* Hide on extra small, show as flex on small and up */}
            {links.map((link) => {
              return (link.active&&
                <Submenu key={link.id} {...link} handleDrawerClose={handleDrawerClose}/>
              );
            })}
          </Stack>

          {/* User Component - pushed to right */}
          <Box sx={{ flexShrink: 0, ml: 'auto' }}> 
            <User />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerClose}
        sx={{
          justifyContent: 'space-between',
          width: 280,
          height: '100%',
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            justifyContent: 'space-between',
            width: 280,
            boxSizing: 'border-box',

          },
        }}
      >
        {/* <Toolbar /> */}
        <Box sx={{ width: 280, pt: 2}}>
        <List component="nav" sx={{ px: 1.5 }}>
          {links.filter(link => link.active).map((item) => (
            <React.Fragment key={item.id}>
              {/* Menu chính */}
              <ListItemButton 
                onClick={() => item.children.length > 0 ? handleToggle(item.id) : handleNavigate(item.url)}
                sx={{ borderRadius: 2, mb: 0.5,
                  '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } // Neutral hover color
                }}
              >
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ fontWeight: 600 }} // Removed color
                />
                {item.children.length > 0 ? (
                  openStates[item.id] ? <ExpandLess /> : <ExpandMore />
                ) : null}
              </ListItemButton>

              {/* Render menu con nếu có */}
              {item.children.length > 0 && (
                <Collapse in={openStates[item.id]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.children.map((child) => (
                      <ListItemButton
                        key={child.id}
                        onClick={() => handleNavigate(child.url)}
                        sx={{ 
                          pl: 4, 
                          borderRadius: 2, 
                          mb: 0.5,
                          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } 
                        }}
                      >
                        {child.icon && (
                          <ListItemIcon sx={{ minWidth: 40 }}> {/* Removed color */}
                            {child.icon}
                          </ListItemIcon>
                        )}
                        <ListItemText 
                          primary={child.text} 
                          primaryTypographyProps={{ fontSize: '0.9rem' }} // Removed color
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              )}
              <Divider sx={{ my: 1, opacity: 0.6 }} />
            </React.Fragment>
          ))}
        </List>
        </Box>
        <Box sx={{ width: '100%', alignSelf: 'center',  backgroundColor:"#f0f0f0", justifyContent:"center", display:"flex", p:2,}}> {/* Neutral background */}
          <User />
        </Box>
      </Drawer>
    </>
  );
};
