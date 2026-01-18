import qlptApi from "api/qlptApi";
import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { VNDFormat, LocalDateFormat, treeOptionsConvert } from "../../utils/DWUtils";
import { BiAddToQueue } from "react-icons/bi";
import { RiDeleteBin5Line } from "react-icons/ri";
import { ImArrowRight } from "react-icons/im";
import Loading from "components/Loading";

import {useForm, Controller} from 'react-hook-form'
import {Stack, Box, TextField, Switch, MenuItem, Button, Typography } from '@mui/material'
import {TableContainer, Paper, Table, TableHead, TableBody, TableRow, TableCell} from '@mui/material'
import {Autocomplete,} from '@mui/material'
import {DevTool} from '@hookform/devtools'
import { Link } from "react-router-dom";
import usePushURL from "hooks/usePushURL";

export const Nhapkho = () => {
  const { pushURL } = usePushURL();
  
  const paramsURL = new URLSearchParams(window.location.search);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  
  const [kho, setKho] = useState([]);
  const [listPhieunhap, setListPhieunhap] = useState([]);
  const [nguoncap, setNguoncap] = useState([]);
  const {control, register, formState: {errors}, watch, setValue} = useForm({
    defaultValues: {
      chung_loai: paramsURL.get("chung_loai"),
      kho_nhap: paramsURL.get("kho_nhap"),
      kho_xuat: paramsURL.get("kho_xuat"),
      nguon_cap: paramsURL.get("nguon_cap"),
      quyetdinh: paramsURL.get("quyetdinh"),
      success: paramsURL.get("success")=='false'?false:true,
      thoi_gian__gte: paramsURL.get('thoi_gian__gte'),
      thoi_gian__lte: paramsURL.get('thoi_gian__lte'),
      chi_tiet_phieu_nhap__phuong_tien: paramsURL.get(
        "chi_tiet_phieu_nhap__phuong_tien"
      ),
      chi_tiet_phieu_nhap__ten: paramsURL.get(
        "chi_tiet_phieu_nhap__ten"
      ),
      search: paramsURL.get(
        "search"
      ),
    },
  })
  const filters = watch()

  const fetchConst = async () => {
    setKho(treeOptionsConvert(await (await qlptApi.getListKho()).data));
    setNguoncap(await (await qlptApi.getListNguoncap()).data);
  };
  const fetchData = async (value) => {
    setLoading(true);
    const list_PT = await qlptApi.getListPhieunhap({
      ...value,
      size: 100,
    });
    setListPhieunhap(list_PT.data);
    pushURL(value);
    setLoading(false);
  };
  useEffect(() => {
    fetchConst();
    fetchData(filters);
  }, []);
  useEffect(()=>{
    let timer;
    const sub = watch((value)=>{
      timer = setTimeout(()=>fetchData(value), 300);
      pushURL(value)
    })
    return () => {
      sub.unsubscribe()
      clearTimeout(timer);
    }
  },[watch])

  const delItem = async (ID) => {
    const result = await qlptApi.delPhieunhap(ID);
    if (result && result.status !== 400) fetchData(watch())
    else alert("Lỗi");
  };

  const tonggia = (phuong_tiens) => {
    let total = 0;
    phuong_tiens.map((e) => {
      total += e.so_luong * e.nguyen_gia;
    });
    return total;
  };

  return (
<Stack>
  <Stack direction='row' justifyContent='space-between' alignItems='baseline' spacing={1} >
    <Link to="/qlpt/xuatnhap/import">
      <Button title="Tạo phiếu mới" startIcon={<BiAddToQueue />}/>
    </Link>
    <Stack direction='row' alignItems='baseline' spacing={1}>
      <Typography>Từ</Typography>
      <TextField type='Date' InputLabelProps={{shrink: true}} size='small'
        {...register('thoi_gian__gte')}/>
        <Typography>đến</Typography>
      <TextField type='Date' InputLabelProps={{shrink: true}} size='small'
        {...register('thoi_gian__lte')}/>
    </Stack>
  </Stack>

  <Stack direction='row-reverse' alignItems='center' gap={1} sx={{mt:2}}>
    <Stack sx={{width: 200}} direction='row' alignItems='center'>
    <Switch size="small" {...register('success')} checked={filters.success} title="Trạng thái"/>
    <Typography>{filters.success?'Đã thực hiện':'Chưa thực hiện'}</Typography>
    </Stack>
    <Controller
      name='nguon_cap'
      control={control}
      defaultValue={null}
      render={({field})=> (
        <Autocomplete
          {...field}
          sx={{width:200}}
          options={treeOptionsConvert(nguoncap)}
          getOptionLabel={(option)=> { 
            return option?.ten || treeOptionsConvert(nguoncap).find(e=>e.id==option)?.ten || "null"
          }}
          isOptionEqualToValue={(option,value)=>option.id==value}
          onChange={(event,value,reason,details)=> setValue('nguon_cap',value?parseInt(value.id):null)}
          renderInput={(params)=>(
            <TextField {...params}
              label="Nguồn cấp"
              size="small"
            />
          )}
          renderOption={(props,option)=>(
            <li {...props} style={{ padding:0, marginLeft: `${option.level * 20}px` }}>{option.ten}</li>
          )}
        />)}
    />
    <Controller
      name='kho_nhap'
      control={control}
      defaultValue={null}
      render={({field})=> (
        <Autocomplete {...field}
          sx={{width:300}}
          options={kho}
          getOptionLabel={(option)=> { 
            return option?.ten || treeOptionsConvert(kho).find(e=>e.id==option)?.ten || "null"
          }}
          isOptionEqualToValue={(option,value)=>option.id==value}
          onChange={(event,value,reason,details)=> setValue('kho_nhap',value?parseInt(value.id):null)}
          renderInput={(params)=>(
            <TextField {...params}
              label="Kho nhập"
              size="small"
            />
          )}
          renderOption={(props,option)=>(
            <li {...props} style={{ padding:0, marginLeft: `${option.level * 20}px` }}>{option.ten}</li>
          )}
        />)}
    />
    <Controller
    name='kho_xuat'
    control={control}
    defaultValue={null}
    render={({field})=> (
      <Autocomplete {...field}
        sx={{width:300}}
        options={treeOptionsConvert(kho)}
        getOptionLabel={(option)=> { 
          return option?.ten || treeOptionsConvert(kho).find(e=>e.id==option)?.ten || "null"
        }}
        isOptionEqualToValue={(option,value)=>option.id==value}
        onChange={(event,value,reason,details)=> setValue('kho_xuat',value?parseInt(value.id):null)}
        renderInput={(params)=>(
          <TextField {...params}
            label="Kho xuất"
            size="small"
          />
        )}
        renderOption={(props,option)=>(
          <li {...props} style={{ padding:0, marginLeft: `${option.level * 20}px` }}>{option.ten}</li>
        )}
      />)}
    />
  </Stack>

  <Stack sx={{mt:2}}>
    {loading ? <Loading />: (
  <Stack>
    <Typography>
      {`Tìm thấy ${listPhieunhap.length} phiếu nhập`}
    </Typography>
    {listPhieunhap.map((e, i) => {
      if (e.phuong_tiens.length || 1)
      return (
        <Stack sx={{mt:3}}>
          <Link to={`/qlpt/xuatnhap/${e.id}`}>
            <Typography>
              {`Ngày ${LocalDateFormat(e.thoi_gian)}: ${kho.find((f) => f.id === e.kho_xuat)?.ten||''}`}
              <ImArrowRight style={{ transform: "translateY(2px)", opacity: "70%" }}/>
              {`${kho.find((f) => f.id === e.kho_nhap)?.ten||''}`}
            </Typography>
            <Typography>
              {e.note && `${e.note}`} {e.quyetdinh && ` (theo Quyết định số ${e.quyetdinh})`}
            </Typography>
          </Link>
            {!filters.success && (
              <RiDeleteBin5Line color="red" onClick={() => delItem(e.id)} />
              )}
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">TT</TableCell>
                    <TableCell align="center">Tên phương tiện</TableCell>
                    <TableCell align="center">Số lượng</TableCell>
                    <TableCell align="center">Nguồn cấp</TableCell>
                    <TableCell align="center">Năm sử dụng</TableCell>
                    <TableCell align="center">Nguyên giá</TableCell>
                    <TableCell align="center">Thành tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {e.phuong_tiens.map((e, i) => (<>
                    <TableRow>
                    <TableCell align="center">{i + 1}</TableCell>
                    <TableCell sx={{color: filters.search == e.ten && "red",}}>{e.ten}</TableCell>
                    <TableCell align="center">{e.so_luong}</TableCell>
                    <TableCell align="center">{nguoncap.find((f)=>f.id == e.nguon_cap)?.ten}</TableCell>
                    <TableCell align="center">{e.nam_cap}</TableCell>
                    <TableCell align="right">{VNDFormat(e.nguyen_gia)}</TableCell>
                    <TableCell align="right">{VNDFormat(e.nguyen_gia * e.so_luong)}</TableCell>
                    </TableRow>
                    {e.kemtheo && e.kemtheo.map((kemtheo, i) => (
                      <TableRow>
                        <TableCell align="center">-</TableCell>
                        <TableCell>{kemtheo.ten}</TableCell>
                        <TableCell align="center">{kemtheo.so_luong}</TableCell>
                      </TableRow>
                    ))}
                    </>
                  ))}
                  <TableRow>
                    <TableCell colSpan={6}></TableCell>
                    <TableCell align="right">
                     <b>{VNDFormat(e.phuong_tiens.reduce((tonggia,e)=>tonggia+=e.nguyen_gia*e.so_luong,0))}</b>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        );
      })}
  </Stack>
  )}
  </Stack>
  <DevTool control={control}/>
</Stack>
);
};
