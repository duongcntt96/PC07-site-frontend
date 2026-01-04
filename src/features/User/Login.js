import React from "react";
import userApi from "api/userApi";
import {DevTool} from '@hookform/devtools'
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {Stack, Button, TextField, Typography} from "@mui/material"

const Login = () => {
  const {control, register, formState: {errors, isValid}, handleSubmit} = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: yupResolver(yup.object({
      username: yup.string().required("Tên đăng nhập không được để trống"),
      password: yup.string().required("Mật khẩu không được để trống")
    }))
  })
  const onSubmit = (value) => {
    userApi
      .login({...value})
      .then(function (response) {
        // success
        response = response.data;
        localStorage.setItem("secret", JSON.stringify(response));
        if (response.status) return;
        else {
          // check redirect url exist
          const query = new URLSearchParams(window.location.search);
          const url = query.get("url") || "profile";
          // redirect
          window.location.replace(url);
        }
      })
      .catch(function (error) {
        alert( error.response.status + ": " + error.response.data.detail);
      });
  }
  return (
      <form onSubmit={handleSubmit(onSubmit)}>
      <Stack sx={{m:5}}>
        <Stack spacing={2} sx={{width:'50%', alignSelf:'center'}}>
          <TextField type="text" label="Tên đăng nhập" {...register('username')}
            error={!!errors.username} helperText={errors.username?.message}/>
          <TextField type="password" label="Mật khẩu" {...register('password')}
            error={!!errors.password} helperText={errors.password?.message}/>
          <Button type="submit" variant="contained" disabled={!isValid}>
            ĐĂNG NHẬP
          </Button>
          <Typography sx={{alignSelf:'center'}}>Bạn chưa có tài khoản?</Typography>
          <Button variant="outlined" href="register" disabled>Đăng ký</Button>
        </Stack>
      </Stack>
      <DevTool control={control}/>
      </form>
  );
};

export { Login };