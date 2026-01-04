import React, { useState } from 'react'

import {Stack,Box, Paper, Typography} from '@mui/material'
import { Link } from 'react-router-dom'

export default function Submenu ({ id, active, url, text, children }) {
    const [open,setOpen] = useState(false)
    const [visible,setVisible] = useState(false)

    return (
        <Stack>
            <Link to={url}
                style={{ padding: '15px 20px'}}
                sx={{
transition: 'transform 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
                onMouseOver={() => setOpen(true)}
                onMouseOut={() => { if(!visible) setOpen(false); }}
                >
                <Typography color='white' fontSize='18px'>
                 {text}
                </Typography>
            </Link>
            {(open && children?.length)?
            <Stack 
            onMouseEnter={()=>{setVisible(true)}}
                    onMouseLeave={()=>{setVisible(false); setOpen(false);}}
            sx={{ position: 'absolute', transform: 'translateX(-33%)', mt: '50px'}} alignItems='center'>
                <Stack sx={{ width: 0, height: 0, borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderBottom: '4px solid hsl(209, 23%, 60%)', transform: 'translateY(-100%)',}}/>
                <Stack
                    
                    sx={{p:3, pt: 2}} spacing={1} component={Paper}>
                    {children.map(({icon,id, url, text})=>(
                       <Stack direction='row' alignItems='center' spacing={1}>
                            {icon}
                            <Link to={url} key={id}>
                                <Typography>
                                    {text}
                                </Typography>   
                            </Link>
                       </Stack>
                    ))}
                </Stack>
            </Stack>
            :<></>}
        </Stack>
    )
}