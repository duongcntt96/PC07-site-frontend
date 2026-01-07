import qlptApi from "api/qlptApi";
import React, { useEffect, useState, useMemo, useCallback } from "react";

import { treeOptionsConvert } from "../../utils/DWUtils";
import usePushURL from "hooks/usePushURL";

import Loading from "components/Loading";
import { Link, useLocation } from "react-router-dom";

import {useForm, Controller} from 'react-hook-form'
import {DevTool} from '@hookform/devtools'
import {Stack, Typography, TextField, Autocomplete, MenuItem, MenuList} from '@mui/material'
import {TableContainer, Paper, Alert, Table, TableHead, TableBody, TableRow, TableCell} from '@mui/material'

export const ListKho = () => {
  const { pushURL } = usePushURL();
  const paramsURL = new URLSearchParams(window.location.search);

  const [kho, setKho] = useState([]);
  const [chungloai, setChungloai] = useState([]);
  const [thucluc, setThucluc] = useState({ count: 0, sum: 0, data: [] });
  const [loading, setLoading] = useState(true);

  const memoizedKhoOptions = useMemo(() => treeOptionsConvert(kho), [kho]);
  const memoizedChungloaiOptions = useMemo(() => treeOptionsConvert(chungloai), [chungloai]);


  const {control, register, watch, setValue, getValues} = useForm({
    defaultValues: {
      chung_loai: paramsURL.get('chung_loai'),
      kho_nhap: paramsURL.get('kho_nhap')||1,
    }
  })
  const fetchConst = useCallback(async () => {
    setLoading(true);
    try {
      const khoData = await qlptApi.getListKho();
      setKho(khoData.data);
      const chungloaiData = await qlptApi.getListChungloai();
      setChungloai(treeOptionsConvert(chungloaiData.data));
    } catch (error) {
      console.error("Failed to fetch constants", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchData = useCallback(async (value={}) => {
    setLoading(true);
    try {
      setThucluc(await qlptApi.getThucluc({...value}));
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(()=>{
    fetchConst();
    fetchData(watch());
  },[])
  useEffect(() => {
    let timer;
    const sub = watch((value)=>{
      timer = setTimeout(()=>fetchData(value), 300);
      pushURL(value);
    })
    return () => {
      sub.unsubscribe()
      clearTimeout(timer);
    }
  }, [watch, fetchData, pushURL]);

  return (
    <>
    <Stack direction='row' justifyContent='flex-end' spacing={1} sx={{mt:3}}>
      <Controller
        name='kho_nhap'
        control={control}
        defaultValue={null}
        render={({field})=> (
          <Autocomplete {...field}
            disableClearable
            sx={{width:300}}
            options={memoizedKhoOptions}
            getOptionLabel={(option)=> {
              return option?.ten || memoizedKhoOptions.find(e=>e.id==option)?.ten || "null"
            }}
            isOptionEqualToValue={(option,value)=>option.id==value}
            onChange={(event,value,reason,details)=> setValue('kho_nhap',value?parseInt(value.id):null)}
            renderInput={(params)=>(
              <TextField {...params}
                label="Đơn vị"
                size="small"
              />
            )}
            renderOption={(props,option)=>(
              <li {...props} style={{ padding:0, marginLeft: `${option.level * 20}px` }}>{option.ten}</li>
            )}
          />)}
      />
      <Controller
        name='chung_loai'
        control={control}
        defaultValue={null}
        render={({field})=> (
          <Autocomplete {...field}
            // disableClearable
            sx={{width:300}}
            options={memoizedChungloaiOptions}
            getOptionLabel={(option)=> {
              return option?.ten || memoizedChungloaiOptions.find(e=>e.id==option)?.ten || "null"
            }}
            isOptionEqualToValue={(option,value)=>option.id==value}
            onChange={(event,value,reason,details)=> setValue('chung_loai',value?parseInt(value.id):null)}
            renderInput={(params)=>(
              <TextField {...params}
                label="Danh mục"
                size="small"
              />
            )}
            renderOption={(props,option)=>(
              <li {...props} style={{padding:'0 10px', margin: 1, marginLeft: `${option.level * 20}px`, backgroundColor:'lightblue', borderRadius:'0 10px 10px 10px'}}>{option.ten}</li>
            )}
            componentsProps={{popper: {style: {width:'fit-content', maxWidth:'60%'}}}}
          />)}
      />
    </Stack>

    {loading && chungloai !== [] ? <Loading /> : (
      thucluc?.count * thucluc?.sum ? (
      <Stack sx={{mt:1}}>
        <Alert severity="success" >
          {`Tìm thấy ${thucluc?.count || 0} danh mục với số lượng ${thucluc?.sum || 0} !`}
        </Alert>

        <TableContainer component={Paper} sx={{ mt: 2}} >
          <Table size="small">
            <TableHead>
              <TableRow>
                {/* <TableCell align="center">TT</TableCell> */}
                <TableCell align="center">Danh mục</TableCell>
                <TableCell align="center">Đvt</TableCell>
                <TableCell align="center" sx={{width: '10%'}}>Số lượng</TableCell>
                {/* <TableCell align="center">Năm sử dụng</TableCell>
                <TableCell align="center">Nguyên giá</TableCell> */}
                {/* <TableCell align="center">Thành tiền</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {chungloai.filter((e)=>e.maso.includes(chungloai.find(e=>e.id==getValues('chung_loai'))?.maso)||!getValues('chung_loai')).map(({id,level,ten,maso}) => {
                if (thucluc.data.filter(e=>e.chung_loai__maso.includes(maso)).length) {
                  const subtotals = thucluc.data.filter(e=>e.chung_loai__maso.includes(maso)).reduce((sum,value)=>sum+=value.totals,0)
                  if (subtotals) return (
                    <>
                      <TableRow>
                        <TableCell colSpan={2} sx={{pl:`${level*10}px`, fontWeight:'bold'}}>
                          {ten}
                        </TableCell>
                        <TableCell align="center" sx={{fontWeight:'bold'}}>
                          {subtotals}
                        </TableCell>
                      </TableRow>
                      {thucluc.data.filter(e=>e.chung_loai==id&&e.totals>0)?.map((f)=>(
                        <TableRow>
                          <TableCell sx={{pl:`${(level+1)*10}px`}}>
                            <Link to={`/qlpt/xuatnhap?search=${f.ten}`}>
                            {f.ten}
                            </Link>
                            </TableCell>
                          <TableCell></TableCell>
                          <TableCell align="center">{f.totals}</TableCell>
                        </TableRow>
                      ))}
                    </>
                  )
                }

              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
      ):(
        <Stack alignItems='center' sx={{mt:3}}>
          <Alert severity="warning" >
            {`Không có phương tiện được tìm thấy !`}
          </Alert>
        </Stack>
      ))}
    <DevTool control={control}/>
    </>
  );
};