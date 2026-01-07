import userApi from "api/userApi";
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import avatar from "assets/images/avatar-default.jpg";
import avatar_default from "assets/images/avatar-default.jpg";
import { useDispatch } from "react-redux";
import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import { decode } from "base-64";
import { LocalDateFormat } from "utils/DWUtils";

import {Stack,TextField,Typography, Avatar} from '@mui/material'

const Profile = () => {
  const dispatch = useDispatch();
  const [user, setUser] = useState({});
  const [capbac, setCapbac] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("secret");
      if (token) {
        // console.log(token);
        const { access } = JSON.parse(token);
        if (access) {
          const accessInfo = JSON.parse(decode(access.split(".")[1]));
          console.log("get username success", accessInfo);
          const id = accessInfo.user_id;
          const rp = await userApi.getUserProfile(id);
          setUser(rp);
        }
      }
      setCapbac(await (await userApi.getCapbac()).data)
    };
    fetchData();
  }, []);

  const {
    username,
    avatar,
    ten,
    ngay_sinh,
    que_quan,
    ho_khau,
    sdt,
    trinh_do_chinh_tri,
    trinh_do_chuyen_mon,
    cap_bac,
    ngay_vao_nganh,
  } = user;

  return (
    <>
      <Helmet>
        <title>{`${ten} - Thông tin cá nhân !`}</title>
      </Helmet>
      <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        spacing={{ xs: 2, md: 3 }} 
        sx={{mt:5}}
      >
        <Stack alignItems="center">
          <Avatar sx={{ width: {xs: 150, md: 200}, height: {xs: 150, md: 200}}}>
            <img src={avatar||avatar_default} alt="avatar" height='100%'/>
          </Avatar>
          <Typography variant="subtitle1">{capbac.find(e=>e.id==cap_bac)?.ten}</Typography>
          <Typography variant="h6">{ten}</Typography>
          <Typography variant="body2">{ LocalDateFormat(ngay_vao_nganh)}</Typography>
        </Stack>

        <Stack sx={{ flexGrow:3}}>
            <h3>Thông tin cá nhân</h3>
            <Stack spacing={2} sx={{mt:3}}>
              <TextField label="Họ và tên" value={ten} disabled
                InputLabelProps={{shrink: true}}
              />
              <TextField label="Ngày sinh" value={LocalDateFormat(ngay_sinh)} disabled
                InputLabelProps={{shrink: true}}
              />
              <TextField label="Số điện thoại" value={sdt} disabled
                InputLabelProps={{shrink: true}}
              />
              <TextField label="Quê quán" value={que_quan} disabled
                InputLabelProps={{shrink: true}}
              />
              <TextField label="Hộ khẩu thường trú" value={ho_khau} disabled
                InputLabelProps={{shrink: true}}
              />
            </Stack>
        </Stack>

        <Stack sx={{ flexGrow:2}}>
          <h3>Trình độ, sở trường</h3>
          <Stack spacing={2} sx={{mt:3}}>
            <TextField label="Trình độ chính trị" value={trinh_do_chinh_tri} disabled
              InputLabelProps={{shrink: true}}
            />
            <TextField label="Trình độ chuyên môn" value={trinh_do_chuyen_mon} disabled
              InputLabelProps={{shrink: true}}
            />
          </Stack>
          </Stack>

      </Stack>
    </>
  );
};

export default Profile;
