import React, { useEffect, useState, useCallback } from 'react'
import qlptApi from 'api/qlptApi'
import {Stack, TextField, Button, Typography, Autocomplete } from '@mui/material'
import {FaSave} from 'react-icons/fa'
import {MdKeyboardArrowDown, MdKeyboardArrowUp} from 'react-icons/md'
import {LoadingButton} from '@mui/lab'
import {TableContainer, Paper, Table, TableHead, TableBody, TableRow, TableCell} from '@mui/material'
import { TiDelete } from 'react-icons/ti'
import {useForm, useFieldArray, Controller} from 'react-hook-form'
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { VNDFormat, swapItems, treeOptionsConvert } from 'utils/DWUtils'
import { useParams, useNavigate } from 'react-router-dom'
import Loading from "components/Loading";

import {DevTool} from '@hookform/devtools'


export const FormNhapkho = () => {
  const navigate = useNavigate();

  const [kho, setKho] = useState([])
  const [chungloai, setChungloai] = useState([])
  const [nguoncap,setNguoncap] = useState([])
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [khoResponse, chungloaiResponse, nguoncapResponse] = await Promise.all([
          qlptApi.getListKho(),
          qlptApi.getListChungloai(),
          qlptApi.getListNguoncap(),
        ]);
        setKho(treeOptionsConvert(khoResponse.data));
        setChungloai(treeOptionsConvert(chungloaiResponse.data));
        setNguoncap(treeOptionsConvert(nguoncapResponse.data));
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      }
    };
    fetchInitialData();
  }, []);

  const [loading,setLoading] = useState(false)
  const [id, setID] = useState(useParams().id)
  const {control, register, formState, handleSubmit, watch, setValue, getValues} = useForm({
    defaultValues: {
    kho_nhap:1,
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
      // success: yup.bool(),
      kho_nhap: yup.number().typeError("Phải là số").required('Không được bỏ trống'),
      thoi_gian: yup.string().required('Không được bỏ trống'),
      note: yup.string(),
      quyetdinh: yup.string(),
      phuong_tiens: yup.array(yup.object().shape({
        chung_loai: yup.number().required("Không được để trống"),
        ten: yup.string().required("Không được để trống"),
        so_luong: yup.number().positive(">0").typeError(""),
        nam_cap: yup.number(),
        nguon_cap: yup.number(),
        nguyen_gia: yup.number(),
    }))
  }))
  })
  const {fields, append, remove, insert, replace, swap} = useFieldArray({
    name: 'phuong_tiens',
    control
  })

  const {errors, isSubmitting} = formState

  useEffect(() => {
    const fetchPhieunhap = async () => {
      if (id) {
        setLoading(true);
        try {
          const { success, kho_nhap, thoi_gian, note, quyetdinh, phuong_tiens } = await qlptApi.getPhieunhap(id);
          setValue("kho_nhap", kho_nhap);
          setValue("thoi_gian", thoi_gian);
          setValue("note", note);
          setValue("quyetdinh", quyetdinh);
          setValue("success", success);
          replace(phuong_tiens);
        } catch (error) {
          console.error("Failed to fetch phieunhap", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPhieunhap();
  }, [id, setValue, replace]);

  const onSubmit = async (value) => {
    // Update
    if (id) {
      const {kho_nhap, thoi_gian, note, quyetdinh, phuong_tiens,} = await qlptApi.updatePhieunhap({...value,id})
      setValue('kho_nhap',kho_nhap)
      setValue('thoi_gian',thoi_gian)
      setValue('note',note)
      setValue('quyetdinh',quyetdinh)
      replace(phuong_tiens)
    }
    // Create
    else {
      const result = await qlptApi.addPhieunhap(value)
      setID(result.id)
      navigate(`/qlpt/xuatnhap/${result.id}`)
    }
  }

  if (loading) return <Loading/>
  else
  return (
  <>
      <Stack component='form' spacing={2} onSubmit={handleSubmit(onSubmit)}>
        <Typography variant="h6">Nhập phương tiện</Typography>
        <Stack direction="row" spacing={3}>
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
                      label="Đơn vị quản lý, sử dụng"
                      size="small"
                      InputLabelProps={{shrink:true, }}
                      inputProps={{...params.inputProps, style:{fontSize:'13px'}}}
                      disabled={isSubmitting}
                    />
                  )}
                  renderOption={(props,option)=>(
                    <li {...props} style={{ padding:0, marginLeft: `${option.level * 20}px` }}>{option.ten}</li>
                  )}
                />)}
            />
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
            <TextField label="Số chứng từ" size='small' InputLabelProps={{shrink: true}} inputProps={{style:{fontSize:'13px'}}}
              {...register('quyetdinh')}
              disabled={isSubmitting}/>
          </Stack>
        </Stack>
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
                  {fields.map((item,index) => (
                  <TableRow>
                    <TableCell padding='none' align='center'>
                      {index+1}
                      </TableCell>
                    <TableCell padding='none'>
                      <Controller
                        name={`phuong_tiens.${index}.chung_loai`}
                        control={control}
                        defaultValue={null}
                        render={({field})=> (
                          <Autocomplete {...field}
                            options={chungloai}
                            getOptionLabel={(option)=> option?.ten || chungloai.find(e=>e.id==option)?.ten || "null" }
                            isOptionEqualToValue={(option,value)=>option.id==value}
                            onChange={(event,value,reason,details)=> setValue(`phuong_tiens.${index}.chung_loai`,value?parseInt(value.id):null)}
                            renderInput={(params)=>(
                              <TextField {...params}
                                size='small'
                                maxRows={2}
                                inputProps={{ ...params.inputProps, style: {fontSize:'13px'}}}
                                error={!!(errors.phuong_tiens&&errors.phuong_tiens[index]&&errors.phuong_tiens[index].chung_loai)}
                                disabled={isSubmitting}
                              />
                            )}
                            renderOption={(props,option)=>(
                              <li {...props} style={{ padding:'0 10px', margin: 1, marginLeft: `${option.level * 20}px`, backgroundColor:'lightblue', borderRadius:'0 10px 10px 10px'}}>{option.ten}</li>
                            )}
                            getOptionDisabled={(option)=> {
                              if(option.children.length) return true
                              return false
                            }}
                            componentsProps={{popper:{style: {width:'fit-content', maxWidth:'70%'}, placement:'bottom-start'}}}
                          />)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size='small'
                        sx={{width:'100%'}}
                        inputProps={{style:{fontSize:'13px'}}}
                        {...register(`phuong_tiens.${index}.ten`)}
                        error={!!(errors.phuong_tiens&&errors.phuong_tiens[index]&&errors.phuong_tiens[index].ten)}
                        disabled={isSubmitting}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        size='small'
                        inputProps={{min:1, style:{fontSize:'13px', textAlign:'center'}}}
                        {...register(`phuong_tiens.${index}.so_luong`)}
                        error={!!(errors.phuong_tiens&&errors.phuong_tiens[index]&&errors.phuong_tiens[index].so_luong)}
                        // helperText={errors.phuong_tiens&&errors.phuong_tiens[index]&&errors.phuong_tiens[index].so_luong?.message}
                        disabled={isSubmitting}
                      />
                    </TableCell>
                    <TableCell>
                      <Controller
                        name={`phuong_tiens.${index}.nguon_cap`}
                        control={control}
                        defaultValue={null}
                        render={({field})=> (
                          <Autocomplete {...field}
                            disableClearable
                            options={nguoncap}
                            getOptionLabel={(option)=> {
                              return option?.ten || nguoncap.find(e=>e.id==option)?.ten || "null"
                            }}
                            isOptionEqualToValue={(option,value)=>option.id==value}
                            onDoubleClick={() => {
                              setValue(`phuong_tiens.${index}.nguon_cap`,getValues(`phuong_tiens.${index-1}.nguon_cap`))
                              setValue(`phuong_tiens.${index}.nam_cap`,getValues(`phuong_tiens.${index-1}.nam_cap`))
                              setValue(`phuong_tiens.${index}.nguyen_gia`,getValues(`phuong_tiens.${index-1}.nguyen_gia`))
                              return
                            }
                          }
                            onChange={(event,value,reason,details)=> setValue(`phuong_tiens.${index}.nguon_cap`,value?parseInt(value.id):null)}
                            renderInput={(params)=> (
                              <TextField {...params}
                                size='small'
                                inputProps={{ ...params.inputProps, style: {fontSize:'13px'}}}
                                error={!!(errors.phuong_tiens&&errors.phuong_tiens[index]&&errors.phuong_tiens[index].nguon_cap)}
                                disabled={isSubmitting}
                              />
                              )}
                            renderOption={(props,option)=>(<li {...props} style={{ padding:0, marginLeft: `${option.level * 20}px` }}>{option.ten}</li>)}
                          />)}
                      />
                    </TableCell>
                    <TableCell>
                    <TextField
                      type="text"
                      size='small'
                      inputProps={{style:{fontSize:'13px', textAlign:'center'}}}
                      {...register(`phuong_tiens.${index}.nam_cap`)}
                      onDoubleClick={()=>setValue(`phuong_tiens.${index}.nam_cap`,getValues(`phuong_tiens.${index-1}.nam_cap`))}
                      error={!!(errors.phuong_tiens&&errors.phuong_tiens[index]&&errors.phuong_tiens[index].so_luong)}
                      disabled={isSubmitting}
                      />
                    </TableCell>
                    <TableCell>
                    <TextField 
                      size='small'
                      inputProps={{style:{fontSize:'13px', textAlign:'right'}}}
                      {...register(`phuong_tiens.${index}.nguyen_gia`)}
                      // value={VNDFormat(getValues(`phuong_tiens.${index}.nguyen_gia`))}
                      onDoubleClick={()=>setValue(`phuong_tiens.${index}.nguyen_gia`,getValues(`phuong_tiens.${index-1}.nguyen_gia`))}
                      onChange={(e)=>setValue(`phuong_tiens.${index}.nguyen_gia`,parseInt(e.target.value.replaceAll(/[,.]/g,'')))}
                      error={!!(errors.phuong_tiens&&errors.phuong_tiens[index]&&errors.phuong_tiens[index].nguyen_gia)}
                      disabled={isSubmitting}
                      />
                    </TableCell>
                    <TableCell>
                    <TextField
                      size='small'
                      inputProps={{style:{fontSize:'13px', textAlign:'right'}}}
                      {...register(`phuong_tiens.${index}.thanh_tien`)}
                      disabled={isSubmitting}
                      />
                    </TableCell>
                    <TableCell>
                      {/* <Button
                        startIcon={<TiDelete/>}
                        size='small' variant='text' color='error'
                        onClick={()=>remove(index)}
                        disabled={isSubmitting}
                        ></Button> */}
                      <Stack direction='row' spacing={1} sx={{m:1}}>
                        {index<fields.length?<MdKeyboardArrowDown
                            onClick={()=>swap(index,index+1)}
                            onDoubleClick={()=>{
                              let _temp = fields[index]
                              remove(index)
                              append(_temp)
                            }}
                            color='darkblue'/>:<></>}
                        <TiDelete onClick={()=>remove(index)} color='red'/>
                      </Stack>
                    </TableCell>
                  </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Button disabled={isSubmitting} variant="outlined" size='small' sx={{mt:1}} onClick={()=>append({})}>Thêm</Button>
          <Stack sx={{mt:5}} direction='row' spacing={2}>
          <LoadingButton onClick={()=>{
            setValue('success',false)
            handleSubmit(onSubmit)()
          }} endIcon={<FaSave/>} loading={isSubmitting&&getValues('success')==false} disabled={isSubmitting&&getValues('success')==true} loadingPosition='end' variant='contained' color="warning" >{getValues('success')?'Chuyển thành bản nháp':'Lưu bản nháp'}</LoadingButton>
          <LoadingButton onClick={()=>{
            setValue('success',true)
            handleSubmit(onSubmit)()
          }} endIcon={<FaSave/>} loading={isSubmitting&&getValues('success')==true} disabled={isSubmitting&&getValues('success')==false} loadingPosition='end' type='submit' variant='contained' >{getValues('success')||getValues('success')==undefined?'Lưu':'Lưu thành bản chính thức'}</LoadingButton>
          </Stack>
        </Stack>
    {/* <DevTool control={control}/> */}
  </>
  )
}