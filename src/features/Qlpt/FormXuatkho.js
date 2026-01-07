import qlptApi from "api/qlptApi";
import { treeOptionsConvert, VNDFormat } from "utils/DWUtils";
import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate} from "react-router-dom";
import Loading from "components/Loading";

import {useForm, useFieldArray, Controller} from 'react-hook-form'
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {DevTool} from '@hookform/devtools'

import {Alert, InputAdornment, Stack, TextField, Button, Typography, Autocomplete } from '@mui/material'
import {TableContainer, Paper, Table, TableHead, TableBody, TableRow, TableCell} from '@mui/material'
import { chungloai as chungloai_ } from "data";


const FormXuatkho = () => {
  const navigate = useNavigate();
  const chungloai = treeOptionsConvert(chungloai_)
  const paramsURL = new URLSearchParams(window.location.search);
  const [id, setID] = useState(useParams().id || paramsURL.get("id"));
  const [kho, setKho] = useState([]);
  // const [chungloai, setChungloai] = useState([]);
  const [nguoncap, setNguoncap] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state here
  // get const data list
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [khoResponse, 
          nguoncapResponse, 
          // chungloaiResponse
        ] = await Promise.all([
          qlptApi.getListKho(),
          qlptApi.getListNguoncap(),
          // qlptApi.getListChungloai(),
        ]);
        setKho(treeOptionsConvert(khoResponse.data));
        setNguoncap(nguoncapResponse.data);
        // setChungloai(treeOptionsConvert(chungloaiResponse.data));
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      } finally {
        setLoading(false); // Set loading to false after data fetch
      }
    };
    fetchInitialData();
  }, []);

  const {control, register, formState, handleSubmit, watch, setValue, getValues} = useForm({
    defaultValues: {
    kho_xuat: null,
    kho_nhap: null,
    thoi_gian: null,
    note:"",
    quyetdinh:"",
    phuong_tiens:[{
      chung_loai: null,
      ten: null,
      so_luong: null,
      nam_cap: null,
      nguon_cap: null,
      nguyen_gia: null,
  },]
  },
    resolver: yupResolver(yup.object({
      kho_xuat: yup.number().typeError("Phải là số").required('Không được bỏ trống'),
      // kho_nhap: yup.number().typeError("Phải là số").required('Không được bỏ trống'),
      note: yup.string(),
      quyetdinh: yup.string(),
      thoi_gian: yup.string().required('Không được bỏ trống'),
      phuong_tiens: yup.array(yup.object().shape({
        chung_loai: yup.number().required("Không được để trống"),
        ten: yup.string().required("Không được để trống"),
        // so_luong: yup.number(),
        nam_cap: yup.number(),
        nguon_cap: yup.number(),
        nguyen_gia: yup.number(),
    }))
  }))
  })
  const {fields, append, remove, insert, replace} = useFieldArray({
    name: 'phuong_tiens',
    control
  })
  const {errors, isSubmitting} = formState

  const nnn = watch("kho_xuat");
  const fetchTonKho = useCallback(async () => {
    if (nnn) {
      try {
        const response = await qlptApi.getTonkho({ export_from: nnn });
        const data = response.data.filter((e) => e.totals !== 0);
        replace(data);
      } catch (error) {
        console.error("Failed to fetch ton kho", error);
      }
    }
  }, [nnn, replace]);

  useEffect(() => {
    fetchTonKho();
  }, [fetchTonKho]);

  const onSubmit = async (value) => {
    const result = await qlptApi.addPhieunhap({...value,phuong_tiens:value.phuong_tiens.filter(e=>e.so_luong), success: true})
    setID(result.id)
    navigate(`/qlpt/xuatnhap/${result.id}`)
    // alert("Submited")
  }

  if (loading) return <Loading />;

  return (
    <Stack component='form' spacing={2} onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="h6">Xuất phương tiện</Typography>
      <Stack direction='row' spacing={2}>
        <Stack width="50%" spacing={2}>
          <Controller
            name='kho_xuat'
            control={control}
            defaultValue={null}
            render={({field})=> (
              <Autocomplete {...field}
              options={kho}
              getOptionLabel={(option)=> {
                return option?.ten || kho.find(e=>e.id==option)?.ten || "null"
              }}
              isOptionEqualToValue={(option,value)=>option.id==value}
              onChange={(event,value,reason,details)=> setValue('kho_xuat',value?parseInt(value.id):null)}
              renderInput={(params)=>(
                <TextField {...params}
                label="Xuất từ"
                size="small"
                error={!!errors.kho_xuat}
                // helperText={errors.kho_xuat?.message}
                InputLabelProps={{shrink:true, }}
                inputProps={{...params.inputProps, style:{fontSize:'13px'}, placeHolder:"Click để chọn"}}
                disabled={isSubmitting}
                />
                )}
                renderOption={(props,option)=>(
                  <li {...props} style={{ padding:0, marginLeft: `${option.level * 20}px` }}>{option.ten}</li>
                  )}
              />)}
            />
          <TextField label="Số chứng từ" size='small' InputLabelProps={{shrink: true}} inputProps={{style:{fontSize:'13px'}}}
            {...register('quyetdinh')}
            disabled={isSubmitting}/>
          <TextField label='Ghi chú'
            size="small"
            InputLabelProps={{shrink: true}}
            inputProps={{style:{fontSize:'13px'}}}
            {...register('note')}
            error={!!errors.note} helperText={errors.note?.message}
            disabled={isSubmitting}
            />
        </Stack>
        <Stack width="50%" spacing={2}>
          <Controller
            name='kho_nhap'
            control={control}
            defaultValue={null}
            render={({field})=> (
              <Autocomplete {...field}
              options={kho}
              getOptionLabel={(option)=> { 
                return option?.ten || kho.find(e=>e.id==option)?.ten || "null"
              }}
              isOptionEqualToValue={(option,value)=>option.id==value}
              onChange={(event,value,reason,details)=> setValue('kho_nhap',value?parseInt(value.id):null)}
              renderInput={(params)=>(
                <TextField {...params}
                label="Nhập vào"
                size="small"
                InputLabelProps={{shrink:true, }}
                inputProps={{...params.inputProps, style:{fontSize:'13px'}, placeHolder:"Để trống trong trường hợp khai báo giảm"}}
                disabled={isSubmitting}
                />
                )}
                renderOption={(props,option)=>(
                  <li {...props} style={{ padding:0, marginLeft: `${option.level * 20}px` }}>{option.ten}</li>
                  )}
              />)}
            />
          <TextField
            label="Thời gian"
            size="small"
            InputLabelProps={{shrink: true}}
            inputProps={{style:{fontSize:'13px'}}}
            type='date'
            {...register('thoi_gian')}
            error={!!errors.thoi_gian} helperText={errors.thoi_gian?.message}
            disabled={isSubmitting}
            />
          
        </Stack>
      </Stack>

      {nnn ? 
      (fields.length ?
        <TableContainer>
          <Table size='small' padding='none'>
            <TableHead>
              <TableRow>
                <TableCell align="center" width={20}>TT</TableCell>
                <TableCell align="center" width={280}>Chủng loại</TableCell>
                <TableCell align="center" width={400}>Tên phương tiện</TableCell>
                <TableCell align="center" width={80}>Số lượng</TableCell>
                <TableCell align="center" width={150}>Nguồn cấp</TableCell>
                <TableCell align="center" width={70}>Năm sử dụng</TableCell>
                <TableCell align="center" width={120}>Nguyên giá</TableCell>
                <TableCell align="center" width={130}>Thành tiền</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fields.length && fields.map((e, i) => (
                <TableRow>
                  <TableCell align="center">{i + 1}</TableCell>
                  <TableCell>{chungloai.find(f=>f.id==e.chung_loai)?.ten || e.chung_loai}</TableCell>
                  <TableCell>{e.ten}</TableCell>
                  <TableCell align="center">
                    <TextField
                    {...register(`phuong_tiens.${i}.so_luong`)}
                    type="number"
                    size="small"
                    // onChange={ (e) => {
                    //   setListPTOfKhoxuat([...listPTOfKhoxuat.fill({...listPTOfKhoxuat[i],so_luong:parseInt(e.target.value)},i,i+1)])
                    // }}
                    onDoubleClick={() => {
                      return setValue(`phuong_tiens.${i}.so_luong`,e.totals)
                    }}
                    inputProps={{min:1, max: e.totals, style: {width:50}}}
                    InputProps={{endAdornment:<InputAdornment position="end">/{e.totals}</InputAdornment>}}
                    />
                  </TableCell>
                  <TableCell align="center">{nguoncap.find(f=>f.id==e.nguon_cap)?.ten || e.nguon_cap}</TableCell>
                  <TableCell align="center">{e.nam_cap}</TableCell>
                  <TableCell align="right">{VNDFormat(e.nguyen_gia)}</TableCell>
                  <TableCell align="right">
                    {VNDFormat(e.nguyen_gia * e.so_luong)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        :
        <Stack alignItems='center'>
          <Alert severity="warning" >
            {`Không có phương tiện được tìm thấy !`}
          </Alert>
      </Stack>
        )
      :
      <Stack alignItems='center'>
        <Alert severity="warning" >
          {`Vui lòng chọn kho xuất !`}
        </Alert>
      </Stack>
      }
      <Button type="submit" variant="contained">
        Lưu
      </Button>
      <DevTool control={control}/>
    </Stack>
  );
};

export { FormXuatkho };
