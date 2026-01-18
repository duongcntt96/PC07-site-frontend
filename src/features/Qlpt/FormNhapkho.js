import React, { useEffect, useState } from "react";
import qlptApi from "api/qlptApi";
import {
  Paper,
  Stack,
  TextField,
  Button,
  Typography,
  Autocomplete,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { FaSave } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { LoadingButton } from "@mui/lab";
import { TiDelete } from "react-icons/ti";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { treeOptionsConvert } from "utils/DWUtils";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "components/Loading";
import { chungloai as chungloai_ } from "data";

// --- COMPONENT XỬ LÝ PT KÈM THEO (CẤP 2) ---
const RenderKemTheo = ({
  nestIndex,
  control,
  register,
  isSubmitting,
  errors,
  setValue,
  chungloai,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `phuong_tiens.${nestIndex}.kemtheo`,
  });

  return (
    <>
      <TableRow sx={{ backgroundColor: "#fafafa" }}>
        <TableCell></TableCell>
        <TableCell colSpan={4}>
          {fields.length ? (
            <Stack direction="row" alignItems="center" spacing={2} p={0.5}>
              <Typography
                variant="caption"
                color="primary"
                sx={{ fontWeight: "bold", fontStyle: "italic" }}
              >
                ∟ Phương tiện, thiết bị trang bị kèm theo:
              </Typography>
            </Stack>
          ) : (
            <Button
              size="small"
              variant="text"
              sx={{
                fontSize: "12px",
                fontStyle: "italic",
                p: 0,
                textTransform: "none",
              }}
              onClick={() => append({ ten: "", so_luong: 1, chung_loai: null })}
            >
              + Thêm phương tiện, thiết bị kèm theo
            </Button>
          )}
        </TableCell>
      </TableRow>

      {fields.map((item, kIndex) => (
        <TableRow key={item.id} sx={{ backgroundColor: "#fafafa" }}>
          <TableCell align="center">
            <Typography variant="caption" color="textSecondary">
              {nestIndex + 1}.{kIndex + 1}
            </Typography>
          </TableCell>
          <TableCell>
            <Controller
              name={`phuong_tiens.${nestIndex}.kemtheo.${kIndex}.chung_loai`}
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  options={chungloai}
                  size="small"
                  getOptionLabel={(option) =>
                    option?.ten ||
                    chungloai.find((e) => e.id == option)?.ten ||
                    ""
                  }
                  onChange={(_, value) =>
                    setValue(
                      `phuong_tiens.${nestIndex}.kemtheo.${kIndex}.chung_loai`,
                      value ? parseInt(value.id) : null
                    )
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      size="small"
                      variant="standard"
                      placeholder="Chọn chủng loại..."
                      error={
                        !!errors.phuong_tiens?.[nestIndex]?.kemtheo?.[kIndex]
                          ?.chung_loai
                      }
                      inputProps={{
                        ...params.inputProps,
                        style: { fontSize: "12px", color: "steelblue" },
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li
                      {...props}
                      style={{
                        padding: "0 10px",
                        margin: 1,
                        marginLeft: `${option.level * 20}px`,
                        backgroundColor: "lightblue",
                        borderRadius: "0 10px 10px 10px",
                      }}
                    >
                      {option.ten}
                    </li>
                  )}
                  getOptionDisabled={(option) => {
                    if (option.children.length) return true;
                    return false;
                  }}
                  componentsProps={{
                    popper: {
                      style: { width: "fit-content", maxWidth: "70%" },
                      placement: "bottom-start",
                    },
                  }}
                />
              )}
            />
          </TableCell>
          <TableCell>
            <TextField
              {...register(`phuong_tiens.${nestIndex}.kemtheo.${kIndex}.ten`)}
              placeholder="Tên phương tiện, thiết bị"
              size="small"
              fullWidth
              variant="standard"
              inputProps={{ style: { fontSize: "12px", color: "steelblue" } }}
              disabled={isSubmitting}
              error={
                !!errors?.phuong_tiens?.[nestIndex]?.kemtheo?.[kIndex]?.ten
              }
            />
          </TableCell>
          <TableCell align="center">
            <TextField
              {...register(
                `phuong_tiens.${nestIndex}.kemtheo.${kIndex}.so_luong`
              )}
              type="number"
              size="small"
              variant="standard"
              sx={{ width: "50px" }}
              inputProps={{
                style: {
                  fontSize: "12px",
                  textAlign: "center",
                  color: "steelblue",
                },
              }}
              disabled={isSubmitting}
            />
          </TableCell>
          <TableCell align="center">
            <TiDelete
              onClick={() => remove(kIndex)}
              color="red"
              style={{ cursor: "pointer", fontSize: "12px" }}
            />
          </TableCell>
        </TableRow>
      ))}
      <TableRow sx={{ backgroundColor: "#fafafa" }}>
        <TableCell></TableCell>
        <TableCell colSpan={4}>
          {fields.length > 0 && (
            <Button
              size="small"
              variant="text"
              sx={{
                fontSize: "12px",
                fontStyle: "italic",
                p: 0,
                textTransform: "none",
              }}
              onClick={() => append({ ten: "", so_luong: 1, chung_loai: null })}
            >
              + Thêm
            </Button>
          )}
        </TableCell>
      </TableRow>
    </>
  );
};

export const FormNhapkho = () => {
  const navigate = useNavigate();
  const chungloai = React.useMemo(() => treeOptionsConvert(chungloai_), []);
  const [kho, setKho] = useState([]);
  const [nguoncap, setNguoncap] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id: urlId } = useParams();
  const [id, setID] = useState(urlId);

  const schema = yup.object({
    kho_nhap: yup
      .number()
      .typeError("Phải là số")
      .required("Không được bỏ trống"),
    thoi_gian: yup.string().required("Không được bỏ trống"),
    phuong_tiens: yup.array(
      yup.object().shape({
        chung_loai: yup.number().required("Bắt buộc"),
        ten: yup.string().required("Bắt buộc"),
        so_luong: yup.number().positive().typeError("Số lượng > 0"),
        nam_cap: yup.number().positive().typeError("Điền năm sử dụng"),
        nguyen_gia: yup.number().positive().typeError("Điền nguyên giá"),
        kemtheo: yup.array(
          yup.object().shape({
            ten: yup.string().required("Không để trống"),
            so_luong: yup.number().positive(),
          })
        ),
      })
    ),
  });

  const { control, register, formState, handleSubmit, setValue, getValues } =
    useForm({
      defaultValues: {
        kho_nhap: 1,
        thoi_gian: new Date().toISOString().split("T")[0],
        note: "",
        quyetdinh: "",
        phuong_tiens: [{ chung_loai: null, ten: "", so_luong: 1, kemtheo: [] }],
      },
      resolver: yupResolver(schema),
    });

  const { fields, append, remove, replace, swap } = useFieldArray({
    name: "phuong_tiens",
    control,
  });

  const { errors, isSubmitting } = formState;

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [khoResponse, nguoncapResponse] = await Promise.all([
          qlptApi.getListKho(),
          qlptApi.getListNguoncap(),
        ]);
        setKho(treeOptionsConvert(khoResponse.data));
        setNguoncap(treeOptionsConvert(nguoncapResponse.data));
      } catch (error) {
        console.error("Failed to fetch initial data", error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchPhieunhap = async () => {
      if (id) {
        setLoading(true);
        try {
          const data = await qlptApi.getPhieunhap(id);
          setValue("kho_nhap", data.kho_nhap);
          setValue("thoi_gian", data.thoi_gian);
          setValue("note", data.note);
          setValue("quyetdinh", data.quyetdinh);
          setValue("success", data.success);
          replace(data.phuong_tiens);
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
    try {
      if (id) {
        const result = await qlptApi.updatePhieunhap({ ...value, id });
        replace(result.phuong_tiens);
      } else {
        const result = await qlptApi.addPhieunhap(value);
        setID(result.id);
        navigate(`/qlpt/xuatnhap/${result.id}`);
      }
    } catch (error) {
      console.error("Submit error", error);
    }
  };

  if (loading) return <Loading />;

  return (
    <Stack
      component="form"
      spacing={2}
      onSubmit={handleSubmit(onSubmit)}
      sx={{ p: 2 }}
    >
      <Typography variant="h6" color="primary">
        Nhập phương tiện
      </Typography>

      <Stack direction="row" spacing={3}>
        <Stack width="50%" spacing={2}>
          <Controller
            name="kho_nhap"
            control={control}
            render={({ field }) => (
              <Autocomplete
                {...field}
                options={kho}
                getOptionLabel={(option) =>
                  option?.ten || kho.find((e) => e.id == option)?.ten || ""
                }
                isOptionEqualToValue={(option, value) => option.id == value}
                onChange={(_, value) =>
                  setValue("kho_nhap", value ? parseInt(value.id) : null)
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Đơn vị quản lý"
                    size="small"
                    InputLabelProps={{ shrink: true }}
                  />
                )}
                renderOption={(props, option) => (
                  <li
                    {...props}
                    style={{ padding: 0, marginLeft: `${option.level * 20}px` }}
                  >
                    {option.ten}
                  </li>
                )}
              />
            )}
          />
          <TextField
            label="Ghi chú"
            size="small"
            InputLabelProps={{ shrink: true }}
            {...register("note")}
          />
        </Stack>
        <Stack width="50%" spacing={2}>
          <TextField
            label="Thời gian"
            size="small"
            type="date"
            InputLabelProps={{ shrink: true }}
            {...register("thoi_gian")}
            error={!!errors.thoi_gian}
          />
          <TextField
            label="Số chứng từ"
            size="small"
            InputLabelProps={{ shrink: true }}
            {...register("quyetdinh")}
          />
        </Stack>
      </Stack>

      <TableContainer>
        <Table size="small" padding="none">
          <TableHead>
            <TableRow>
              <TableCell align="center" width={50}>
                TT
              </TableCell>
              <TableCell align="center" width={280}>
                Chủng loại
              </TableCell>
              <TableCell align="center" width={400}>
                Tên phương tiện
              </TableCell>
              <TableCell align="center" width={80}>
                Số lượng
              </TableCell>
              <TableCell align="center" width={150}>
                Nguồn cấp
              </TableCell>
              <TableCell align="center" width={70}>
                Năm sử dụng
              </TableCell>
              <TableCell align="center" width={120}>
                Nguyên giá
              </TableCell>
              <TableCell align="center" width={130}>
                Thành tiền
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fields.map((item, index) => (
              <>
                <TableRow>
                  <TableCell padding="none" align="center">
                    {index + 1}
                  </TableCell>
                  <TableCell padding="none">
                    <Controller
                      name={`phuong_tiens.${index}.chung_loai`}
                      control={control}
                      defaultValue={null}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          options={chungloai}
                          getOptionLabel={(option) =>
                            option?.ten ||
                            chungloai.find((e) => e.id == option)?.ten ||
                            "null"
                          }
                          isOptionEqualToValue={(option, value) =>
                            option.id == value
                          }
                          onChange={(event, value, reason, details) =>
                            setValue(
                              `phuong_tiens.${index}.chung_loai`,
                              value ? parseInt(value.id) : null
                            )
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              maxRows={2}
                              inputProps={{
                                ...params.inputProps,
                                style: { fontSize: "13px" },
                              }}
                              error={
                                !!(
                                  errors.phuong_tiens &&
                                  errors.phuong_tiens[index] &&
                                  errors.phuong_tiens[index].chung_loai
                                )
                              }
                              disabled={isSubmitting}
                            />
                          )}
                          renderOption={(props, option) => (
                            <li
                              {...props}
                              style={{
                                padding: "0 10px",
                                margin: 1,
                                marginLeft: `${option.level * 20}px`,
                                backgroundColor: "lightblue",
                                borderRadius: "0 10px 10px 10px",
                              }}
                              title={option.id}
                              key={option.id}
                            >
                              {option.ten}
                            </li>
                          )}
                          getOptionDisabled={(option) => {
                            if (option.children.length) return true;
                            return false;
                          }}
                          componentsProps={{
                            popper: {
                              style: { width: "fit-content", maxWidth: "70%" },
                              placement: "bottom-start",
                            },
                          }}
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      sx={{ width: "100%" }}
                      inputProps={{ style: { fontSize: "13px" } }}
                      {...register(`phuong_tiens.${index}.ten`)}
                      error={
                        !!(
                          errors.phuong_tiens &&
                          errors.phuong_tiens[index] &&
                          errors.phuong_tiens[index].ten
                        )
                      }
                      disabled={isSubmitting}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      size="small"
                      inputProps={{
                        min: 1,
                        style: { fontSize: "13px", textAlign: "center" },
                      }}
                      {...register(`phuong_tiens.${index}.so_luong`)}
                      error={
                        !!(
                          errors.phuong_tiens &&
                          errors.phuong_tiens[index] &&
                          errors.phuong_tiens[index].so_luong
                        )
                      }
                      // helperText={errors.phuong_tiens&&errors.phuong_tiens[index]&&errors.phuong_tiens[index].so_luong?.message}
                      disabled={isSubmitting}
                    />
                  </TableCell>
                  <TableCell>
                    <Controller
                      name={`phuong_tiens.${index}.nguon_cap`}
                      control={control}
                      defaultValue={null}
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          disableClearable
                          options={nguoncap}
                          getOptionLabel={(option) => {
                            return (
                              option?.ten ||
                              nguoncap.find((e) => e.id == option)?.ten ||
                              "null"
                            );
                          }}
                          isOptionEqualToValue={(option, value) =>
                            option.id == value
                          }
                          onDoubleClick={() => {
                            setValue(
                              `phuong_tiens.${index}.nguon_cap`,
                              getValues(`phuong_tiens.${index - 1}.nguon_cap`)
                            );
                            setValue(
                              `phuong_tiens.${index}.nam_cap`,
                              getValues(`phuong_tiens.${index - 1}.nam_cap`)
                            );
                            setValue(
                              `phuong_tiens.${index}.nguyen_gia`,
                              getValues(`phuong_tiens.${index - 1}.nguyen_gia`)
                            );
                            return;
                          }}
                          onChange={(event, value, reason, details) =>
                            setValue(
                              `phuong_tiens.${index}.nguon_cap`,
                              value ? parseInt(value.id) : null
                            )
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              size="small"
                              inputProps={{
                                ...params.inputProps,
                                style: { fontSize: "13px" },
                              }}
                              error={
                                !!(
                                  errors.phuong_tiens &&
                                  errors.phuong_tiens[index] &&
                                  errors.phuong_tiens[index].nguon_cap
                                )
                              }
                              disabled={isSubmitting}
                            />
                          )}
                          renderOption={(props, option) => (
                            <li
                              {...props}
                              style={{
                                padding: 0,
                                marginLeft: `${option.level * 20}px`,
                              }}
                            >
                              {option.ten}
                            </li>
                          )}
                        />
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="text"
                      size="small"
                      inputProps={{
                        style: { fontSize: "13px", textAlign: "center" },
                      }}
                      {...register(`phuong_tiens.${index}.nam_cap`)}
                      onDoubleClick={() =>
                        setValue(
                          `phuong_tiens.${index}.nam_cap`,
                          getValues(`phuong_tiens.${index - 1}.nam_cap`)
                        )
                      }
                      error={
                        !!(
                          errors.phuong_tiens &&
                          errors.phuong_tiens[index] &&
                          errors.phuong_tiens[index].so_luong
                        )
                      }
                      disabled={isSubmitting}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      inputProps={{
                        style: { fontSize: "13px", textAlign: "right" },
                      }}
                      {...register(`phuong_tiens.${index}.nguyen_gia`)}
                      // value={VNDFormat(getValues(`phuong_tiens.${index}.nguyen_gia`))}
                      onDoubleClick={() =>
                        setValue(
                          `phuong_tiens.${index}.nguyen_gia`,
                          getValues(`phuong_tiens.${index - 1}.nguyen_gia`)
                        )
                      }
                      onChange={(e) =>
                        setValue(
                          `phuong_tiens.${index}.nguyen_gia`,
                          parseInt(e.target.value.replaceAll(/[,.]/g, ""))
                        )
                      }
                      error={
                        !!(
                          errors.phuong_tiens &&
                          errors.phuong_tiens[index] &&
                          errors.phuong_tiens[index].nguyen_gia
                        )
                      }
                      disabled={isSubmitting}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      size="small"
                      inputProps={{
                        style: { fontSize: "13px", textAlign: "right" },
                      }}
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
                    <Stack direction="row" spacing={1} sx={{ m: 1 }}>
                      {index < fields.length ? (
                        <MdKeyboardArrowDown
                          onClick={() => swap(index, index + 1)}
                          onDoubleClick={() => {
                            let _temp = fields[index];
                            remove(index);
                            append(_temp);
                          }}
                          color="darkblue"
                        />
                      ) : (
                        <></>
                      )}
                      <TiDelete onClick={() => remove(index)} color="red" />
                    </Stack>
                  </TableCell>
                </TableRow>
                {/* Phương tiện, thiết bị kèm theo */}

                <RenderKemTheo
                  nestIndex={index}
                  control={control}
                  register={register}
                  isSubmitting={isSubmitting}
                  errors={errors}
                  setValue={setValue}
                  chungloai={chungloai}
                />
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="outlined"
        size="small"
        onClick={() => append({ ten: "", so_luong: 1, kemtheo: [] })}
      >
        + Thêm phương tiện mới
      </Button>

      <Stack sx={{ mt: 5 }} direction="row" spacing={2}>
        <LoadingButton
          onClick={() => {
            setValue("success", false);
            handleSubmit(onSubmit)();
          }}
          endIcon={<FaSave />}
          loading={isSubmitting && getValues("success") == false}
          disabled={isSubmitting && getValues("success") == true}
          loadingPosition="end"
          variant="contained"
          color="warning"
        >
          {getValues("success") ? "Chuyển thành bản nháp" : "Lưu bản nháp"}
        </LoadingButton>
        <LoadingButton
          onClick={() => {
            setValue("success", true);
            handleSubmit(onSubmit)();
          }}
          endIcon={<FaSave />}
          loading={isSubmitting && getValues("success") == true}
          disabled={isSubmitting && getValues("success") == false}
          loadingPosition="end"
          type="submit"
          variant="contained"
        >
          {getValues("success") || getValues("success") == undefined
            ? "Lưu"
            : "Lưu thành bản chính thức"}
        </LoadingButton>
      </Stack>
    </Stack>
  );
};
