import React, { useState } from 'react'

import {Stack,Box, Paper, Typography} from '@mui/material'
import { Link } from 'react-router-dom'

export default function Submenu ({ id, active, url, text, children }) {
    const [open,setOpen] = useState(false)
    const [visible,setVisible] = useState(false)

    return (
        <Stack>
            <Link to={url}
                style={{ padding: '15px' }}
                onMouseOver={(e) => { setOpen(true);

                    e.target.style.transform = "scale(1.2)";
                    e.target.style.transition = "transform 0.5s ease-in-out"; 
                    // e.target.style.margin = "15px";
                    // e.target.style.padding = "0px"
                }}
                onMouseOut={(e) => { if(!visible) setOpen(false);

                    e.target.style.transform = "scale(1)";
                    e.target.style.transition = "transform 0.5s ease-in-out";
                    // e.target.style.margin = "0px";
                    // e.target.style.padding = "15px 0px"
                }} 
                >
                <Typography color='white'>
                 {text}
                </Typography>
            </Link>
            {(open && children?.length)?
            <Stack sx={{ position: 'absolute', transform: 'translateX(-33%)', mt: '60px'}} alignItems='center'>
                <Stack sx={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderBottom: '4px solid hsl(209, 23%, 60%)', transform: 'translateY(-100%)',}}/>
                <Stack
                    onMouseEnter={()=>{setVisible(true)}}
                    onMouseLeave={()=>{setVisible(false); setOpen(false);}}
                    sx={{p:3, pt: 2}} spacing={1} component={Paper}>
                    {children.map(({icon,id, url, text})=>(
                       <Stack direction='row' alignItems='center' spacing={1}>
                        {icon}
                        <Link to={url} key={id}>{text}</Link>
                       </Stack>
                    ))}
                </Stack>
            </Stack>
            :<></>}
        </Stack>
    )
}