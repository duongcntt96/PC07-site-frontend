import React, { useState, memo, useCallback } from 'react'

import {Stack,Box, Paper, Typography} from '@mui/material'
import { Link } from 'react-router-dom'

const MemoizedSubmenuLink = memo(({ icon, id, url, text }) => (
  <Stack 
    direction='row' 
    alignItems='center' 
    spacing={1.5} // Tăng khoảng cách một chút cho thoáng
    sx={{
      p: 1,
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      color: '#475569', // Màu xám đậm (Slate 600) - dễ đọc
      '&:hover': {
        backgroundColor: '#f1f5f9', // Nền xám nhạt khi hover
        color: '#6366f1', // Đổi sang màu Indigo (Màu của các app hiện đại)
        '& svg': { color: '#6366f1' },
      },
    }}
  >
    <Box sx={{ display: 'flex', color: 'inherit' }}>{icon}</Box>
    <Link 
      to={url} 
      style={{ 
        textDecoration: 'none', 
        color: 'inherit', // Thừa hưởng màu từ Stack
        fontWeight: 500,
        fontSize: '0.95rem'
      }}
    >
      {text}
    </Link>
  </Stack>
));

export default memo(function Submenu ({ id, active, url, text, children }) {
    const [open,setOpen] = useState(false)
    const [visible,setVisible] = useState(false)

    return (
        <Stack sx={{ p:1 }} onMouseOver={()=>{setOpen(true) }} onMouseOut={() => { if(!visible) setOpen(false); }}>
            <Link to={url}>
                <Typography 
                  sx={{
                    p: 1.5,
                    borderRadius: '8px',
                    transition: 'all 0.2s ease-in-out',
                    color: 'white',
                    textAlign: 'center',
                    fontSize: '18px',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                 {text}
                </Typography>
            </Link>
            {(open && children?.length)?
            <Stack 
            onMouseEnter={()=>{setVisible(true)}}
            onMouseLeave={()=>{setOpen(false); setVisible(false); }}
            sx={{
              position: 'absolute',
              // transform: 'translateX(-33%)',
              mt: '50px'
            }}
            alignItems='center'
            >
                <Stack sx={{ position: 'absolute', transform: 'translateY(-100%)',  width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderBottom: '4px solid hsl(209, 23%, 60%)',}}/>
                <Stack
                    sx={{p:3, pt: 2}} spacing={1} component={Paper}>
                    {children.map((linkProps)=>(<MemoizedSubmenuLink key={linkProps.id} {...linkProps}/>))}
                </Stack>
            </Stack>

            :<></>}
        </Stack>
    )
})