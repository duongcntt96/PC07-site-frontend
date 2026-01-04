import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Box, Paper, TextField, Typography, Stack, Button,
  Divider, InputAdornment, Card, CardContent
} from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PaymentsIcon from '@mui/icons-material/Payments';

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { DevTool } from "@hookform/devtools"; // Assuming you have this installed

// Components & Utils
import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import phuongtienhuhongApi from "api/phuongtienhuhongApi";
import { docSoThanhChu } from "features/Qlpt/Utils/DWUtils";
import PageTitle from "components/PageTitle";

const schema = yup.object().shape({
  don_vi_quan_ly: yup.string().required("Đơn vị quản lý là bắt buộc"),
  loai_phuong_tien: yup.string().required("Loại phương tiện là bắt buộc"),
  nhan_hieu: yup.string().required("Nhãn hiệu là bắt buộc"),
  nhan_hieu_sat_xi: yup.string().required("Nhãn hiệu xe nền là bắt buộc"),
  bien_kiem_soat: yup.string().required("Biển kiểm soát là bắt buộc"),
  nguoi_quan_ly: yup.string().optional(),
  nguyen_nhan_hu_hong: yup.string().required("Nguyên nhân hư hỏng là bắt buộc"),
  bien_phap_thuc_hien: yup.string().optional(),
  de_xuat: yup.string().optional(),
  // du_tru_kinh_phi: yup.number()
  //   .typeError("Kinh phí phải là số")
  //   .min(0, "Kinh phí không thể âm")
  //   .optional(),
  ket_qua: yup.string().optional(),
});

const PhuongtienHuHongForm = () => {
  const dispatch = useDispatch();
  const [generalError, setGeneralError] = useState(null);

  const { register, handleSubmit, formState, setValue, watch, control, setError } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      don_vi_quan_ly: "",
      loai_phuong_tien: "",
      nhan_hieu: "",
      nhan_hieu_sat_xi: "",
      bien_kiem_soat: "",
      nguoi_quan_ly: "",
      nguyen_nhan_hu_hong: "",
      bien_phap_thuc_hien: "",
      de_xuat: "",
      du_tru_kinh_phi: "",
      ket_qua: "",
    }
  });

  const { errors, isSubmitting } = formState;
  const du_tru_kinh_phi_value = watch("du_tru_kinh_phi");

  const onSubmit = async (values) => {
    setGeneralError(null);

    try {
      const payload = {
        ...values,
        du_tru_kinh_phi: parseFloat(values.du_tru_kinh_phi) || 0
      };

      const resp = await phuongtienhuhongApi.add(payload);
      if (resp && (resp.status === 201 || resp.status === 200 || resp.id)) {
        window.location.replace("/phuongtien/huhong");
      }
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data && err.response.data.errors) {
        // Assuming API returns errors in a format like { fieldName: ["error message"] }
        Object.entries(err.response.data.errors).forEach(([fieldName, messages]) => {
          console.log(fieldName);
          
          setError(fieldName, { type: "manual", message: messages[0] });
        });
      } else {
        setGeneralError("Có lỗi xảy ra khi lưu dữ liệu. Vui lòng thử lại.");
      }
    }
  };

  return (
    <Box
      sx={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '40px', p: 3 }}
      onMouseOver={() => dispatch(closeSubMenu())}
    >
      <PageTitle title="Thêm phương tiện hư hỏng" />
      
      <Box sx={{  mx: 'auto', mt: 4, px: 2 }}>
        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b', mb: 3 }}>
              Thêm phương tiện hư hỏng
            </Typography>

            {generalError && (
              <Box sx={{ p: 2, mb: 3, backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 2, color: '#dc2626' }}>
                {generalError}
              </Box>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack direction={{ xs: "column", lg: "row" }} spacing={3} sx={{ pb: 2 }}>
                {/* Thông tin đơn vị & phương tiện */}
                <Stack sx={{ flex: { xs: '1 1 100%', lg: '1 1 25%' } }} spacing={2.5}>
                    <TextField
                      label="Đội quản lý, sử dụng"
                      fullWidth
                      size="small"
                      {...register("don_vi_quan_ly")}
                      error={!!errors.don_vi_quan_ly}
                      helperText={errors.don_vi_quan_ly?.message}
                      placeholder="Ví dụ: Đội chữa cháy và CNCH KV Trảng Bàng"
                      required
                    />
                    <TextField
                      label="Loại phương tiện"
                      fullWidth
                      size="small"
                      {...register("loai_phuong_tien")}
                      error={!!errors.loai_phuong_tien}
                      helperText={errors.loai_phuong_tien?.message}
                      placeholder="Ví dụ: Xe chữa cháy, Xe thang 32m"
                      required
                    />
                    <TextField
                      label="Biển kiểm soát"
                      fullWidth
                      size="small"
                      {...register("bien_kiem_soat")}
                      error={!!errors.bien_kiem_soat}
                      helperText={errors.bien_kiem_soat?.message}
                    />
                    <TextField
                      label="Người trực tiếp quản lý"
                      fullWidth
                      size="small"
                      {...register("nguoi_quan_ly")}
                      error={!!errors.nguoi_quan_ly}
                      helperText={errors.nguoi_quan_ly?.message}
                      placeholder="Ví dụ: Báo Minh Quân"
                    />
                  </Stack>

                {/* Nhãn hiệu & Kinh phí */}
                <Stack sx={{ flex: { xs: '1 1 100%', lg: '1 1 25%' } }} spacing={2.5}>
                    <TextField
                      label="Nhãn hiệu"
                      fullWidth
                      size="small"
                      {...register("nhan_hieu")}
                      error={!!errors.nhan_hieu}
                      helperText={errors.nhan_hieu?.message}
                      placeholder="Ví dụ: Hino DOL/Isuzu Morita..."
                    />
                    <TextField
                      label="Nhãn hiệu xe nền"
                      fullWidth
                      size="small"
                      {...register("nhan_hieu_sat_xi")}
                      error={!!errors.nhan_hieu_sat_xi}
                      helperText={errors.nhan_hieu_sat_xi?.message}
                      placeholder="Ví dụ: Hino FG1JJUB/Isuzu FVR..."
                    />
                    <Box>
                      <TextField
                        label="Dự trù kinh phí (VNĐ)"
                        fullWidth
                        size="small"
                        {...register("du_tru_kinh_phi")}
                        value={Number(du_tru_kinh_phi_value).toLocaleString('vi-VN') === "0" ? "" : Number(du_tru_kinh_phi_value).toLocaleString('vi-VN')}
                        onChange={(e) => setValue("du_tru_kinh_phi", e.target.value.replace(/\D/g, ""))}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PaymentsIcon sx={{ color: '#ef4444' }} />
                            </InputAdornment>
                          ),
                        }}
                        sx={{ "& .MuiInputBase-input": { fontWeight: 700, color: '#ef4444' } }}
                        error={!!errors.du_tru_kinh_phi}
                        helperText={errors.du_tru_kinh_phi?.message}
                      />
                      {du_tru_kinh_phi_value && (
                        <Box sx={{ mt: 1.5, p: 1.5, backgroundColor: '#f1f5f9', borderRadius: 2, borderLeft: '4px solid #0284c7', wordWrap: 'break-word' }}>
                          <Typography variant="caption" sx={{ fontStyle: 'italic', color: '#0284c7', fontWeight: 500, whiteSpace: 'normal', overflowWrap: 'break-word' }}>
                            Bằng chữ: {docSoThanhChu(du_tru_kinh_phi_value)}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Stack>

                <Stack sx={{ flex: { xs: '1 1 100%', lg: '1 1 50%' } }} spacing={2.5}> 
                    <TextField
                      label="Tình trạng, Nguyên nhân hư hỏng"
                      fullWidth
                      multiline
                      rows={4}  
                      {...register("nguyen_nhan_hu_hong")}
                      error={!!errors.nguyen_nhan_hu_hong}
                      helperText={errors.nguyen_nhan_hu_hong?.message}
                    />
                    <TextField
                      label="Biện pháp đã thực hiện"
                      fullWidth
                      multiline
                      rows={3} 
                      {...register("bien_phap_thuc_hien")}
                      error={!!errors.bien_phap_thuc_hien}
                      helperText={errors.bien_phap_thuc_hien?.message}
                    />
                    <TextField
                      label="Đề xuất"
                      fullWidth
                      multiline
                      rows={3} 
                      {...register("de_xuat")}
                      error={!!errors.de_xuat}
                      helperText={errors.de_xuat?.message}
                    />
                    <TextField
                      label="Kết quả/Hiện trạng"
                      fullWidth
                      size="small"
                      {...register("ket_qua")}
                      error={!!errors.ket_qua}
                      helperText={errors.ket_qua?.message}
                      placeholder="Ví dụ: Đã hoàn thành sửa chữa, Đang chờ báo giá..."
                    />
                  </Stack>
              </Stack>

            </form>
          </CardContent>
        </Card>
      </Box>
      {/* Nút bấm outside of Card */} 
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }} onMouseOver={() => dispatch(closeSubMenu())}>
        <Stack direction="row" spacing={2}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={<SaveIcon />}
            sx={{
              px: 4,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              backgroundColor: '#0ea5e9',
              '&:hover': { backgroundColor: '#0284c7' }
            }}
            onClick={handleSubmit(onSubmit)} // Attach handleSubmit here
          >
            {isSubmitting ? "Đang gửi..." : "Lưu báo cáo"}
          </Button>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => window.history.back()}
            sx={{ px: 3, borderRadius: 2, textTransform: 'none', fontWeight: 600, color: '#64748b', borderColor: '#e2e8f0' }}
          >
            Hủy bỏ
          </Button>
        </Stack>
      </Box>
      <DevTool control={control} />
    </Box>
  );
};

export default PhuongtienHuHongForm;