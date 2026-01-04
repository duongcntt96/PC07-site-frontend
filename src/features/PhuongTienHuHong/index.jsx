import React, { useEffect, useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  Container, Box, Stack, Typography, Button, TextField, Paper, 
  Chip, TableContainer, Table, TableHead, TableBody, TableRow, 
  TableCell, Autocomplete, InputAdornment
} from "@mui/material";
import { Link } from "react-router-dom";
import XLSX from 'xlsx-js-style';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

// Components
import PageTitle from "components/PageTitle";
import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import phuongtienhuhongApi from "api/phuongtienhuhongApi";
import Loading from "components/Loading";
import { docSoThanhChu } from "features/Qlpt/Utils/DWUtils";

const PhuongTienHuHong = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKetQua, setSelectedKetQua] = useState([]);
  const [selectedDonVi, setSelectedDonVi] = useState([]);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await phuongtienhuhongApi.getList({ size: 500, hu_hong: true });
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setItems([]);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // --- Logic Filtering ---
  const danhSachDonVi = useMemo(() => [...new Set(items.map(i => i.don_vi_quan_ly))].filter(Boolean).sort(), [items]);
  const danhSachKetQua = useMemo(() => [...new Set(items.map(i => i.ket_qua || "Chưa xác định"))].filter(Boolean).sort(), [items]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchSearch = (item.bien_kiem_soat || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (item.nhan_hieu || "").toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchDonVi = selectedDonVi.length === 0 || selectedDonVi.includes(item.don_vi_quan_ly);
      
      const itemKQ = item.ket_qua || "Chưa xác định";
      const matchKetQua = selectedKetQua.length === 0 || selectedKetQua.includes(itemKQ);
      
      return matchSearch && matchDonVi && matchKetQua;
    });
  }, [items, searchTerm, selectedDonVi, selectedKetQua]);

  const totalKinhPhi = useMemo(() => {
    return filteredItems.reduce((sum, item) => sum + (parseFloat(item.du_tru_kinh_phi) || 0), 0);
  }, [filteredItems]);

  const exportToExcel = () => {
    const dataToExport = filteredItems.map((item, index) => ({
      "Stt": index + 1,
      "Đơn vị quản lý": item.don_vi_quan_ly,
      "Loại phương tiện": item.loai_phuong_tien,
      "Nhãn hiệu": item.nhan_hieu,
      "Biển kiểm soát": item.bien_kiem_soat,
      "Nguyên nhân hư hỏng": item.nguyen_nhan_hu_hong,
      "Dự trù kinh phí": Number(item.du_tru_kinh_phi) || 0,
      "Kết quả": item.ket_qua || "Chưa xác định",
    }));
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DanhSach");
    XLSX.writeFile(workbook, "Danh_sach_phuong_tien_hu_hong.xlsx");
  };

  if (loading) return <Loading />;

  return (
    <main onMouseOver={() => dispatch(closeSubMenu())} style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '40px' }}>
      <PageTitle title="Phương tiện hư hỏng" />

      {/* BỘ LỌC */}
      <Stack sx={{mt:5, mb:2, py:2, borderRadius:2, backgroundColor:'rgba(234, 234, 234, 0.38)'}} spacing={3}>
        <Stack direction="row" justifyContent="space-around" alignItems="center" sx={{ width: '100%'}}>
          <TextField 
            type="text" 
            sx={{minWidth: "25%"}}
            label="Tìm kiếm bằng biển số hoặc nhãn hiệu"
            size="small"
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Autocomplete 
            multiple
            limitTags={2}
            filterSelectedOptions
            sx={{minWidth: "25%", maxWidth: "30%"}}
            options={danhSachDonVi}
            getOptionLabel={(option) => option}
            value={selectedDonVi}
            onChange={(event, newValue) => setSelectedDonVi(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Lọc theo đơn vị quản lý" size="small" />
            )}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip 
                  label={option.length > 25 ? ".." + option.slice(22): option} 
                  {...getTagProps({ index })} 
                  color="primary" 
                  variant="outlined" 
                  size="small"
                />
              ))
            }
          />

          <Autocomplete 
            multiple
            limitTags={2}
            filterSelectedOptions
            sx={{minWidth: "25%", maxWidth: "35%"}}
            options={danhSachKetQua}
            getOptionLabel={(option) => option}
            value={selectedKetQua}
            onChange={(event, newValue) => setSelectedKetQua(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Lọc theo Hiện trạng/Kết quả" size="small" />
            )}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip 
                  label={option.length > 20 ? option.slice(0,14) + "..": option} 
                  {...getTagProps({ index })} 
                  color="primary" 
                  variant="outlined" 
                  size="small"
                />
              ))
            }
          />

          <Button 
            variant="contained" 
            onClick={exportToExcel} 
            disabled={!filteredItems.length}
            startIcon={<FileDownloadIcon />}
            sx={{ backgroundColor: '#334155' }}
          >
            {filteredItems.length ? `Tải về (${filteredItems.length})` : "null"}
          </Button>
        </Stack>
      </Stack>

      <Box sx={{ mx: 2 }}>
        <Stack sx={{mb:2}} direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Thống kê phương tiện hư hỏng</Typography>
          <Link style={{borderRadius: '8px', padding: '10px 20px'}} to="/qlpt/huhong/add">
            <Button variant="outlined" startIcon={<AddCircleOutlineIcon />}>
              Thêm mới
            </Button>
          </Link>
        </Stack>

        <TableContainer component={Paper} className="table-card shadow-sm" sx={{transform: 'rotateX(180deg)', borderRadius: 3}}>
          <Table size="small" sx={{ minWidth: 2500, transform: 'rotateX(180deg)' }} className="table-custom">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f1f5f9' }}>
                <TableCell style={{ width: '35px', textAlign: 'center', fontWeight: 700 }}>Stt</TableCell>
                <TableCell style={{ width: '160px', textAlign: 'center', fontWeight: 700 }}>Đơn vị quản lý</TableCell>
                <TableCell style={{ width: '100px', textAlign: 'center', fontWeight: 700 }}>Loại PT</TableCell>
                <TableCell style={{ width: '100px', textAlign: 'center', fontWeight: 700 }}>Nhãn hiệu</TableCell>
                <TableCell style={{ width: '100px', textAlign: 'center', fontWeight: 700 }}>Nhãn hiệu xe nền</TableCell>
                <TableCell style={{ width: '100px', textAlign: 'center', fontWeight: 700 }}>Biển số</TableCell>
                <TableCell style={{ width: '130px', textAlign: 'center', fontWeight: 700 }}>Người trực tiếp quản lý, sử dụng</TableCell>
                <TableCell style={{ width: '280px', textAlign: 'center', fontWeight: 700 }}>Tình trạng, Nguyên nhân hư hỏng</TableCell>
                <TableCell style={{ width: '280px', textAlign: 'center', fontWeight: 700 }}>Biện pháp đã thực hiện</TableCell>
                <TableCell style={{ width: '280px', textAlign: 'center', fontWeight: 700 }}>Đề xuất</TableCell>
                <TableCell style={{ width: '130px', textAlign: 'center', fontWeight: 700 }}>Dự trù kinh phí</TableCell>
                <TableCell style={{ width: '120px', textAlign: 'center', fontWeight: 700 }}>Hiện trạng/Kết quả</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredItems.map((item, index) => {
                const isFinished = (item.ket_qua || "").includes('Đã hoàn thành') || (item.ket_qua || "").includes('Đã sửa xong');
                return (
                  <TableRow key={item.id || index} sx={{ "&:nth-of-type(even)": { backgroundColor: '#f8fafc' }, "&:hover": { backgroundColor: '#f1f5f9' } }}>
                    <TableCell className="text-center text-muted">{index + 1}</TableCell>
                    <TableCell className="fw-bold">{item.don_vi_quan_ly}</TableCell>
                    <TableCell className="text-center">{item.loai_phuong_tien}</TableCell>
                    <TableCell className="text-center">{item.nhan_hieu}</TableCell>
                    <TableCell className="text-center">{item.nhan_hieu_sat_xi}</TableCell>
                    <TableCell className="text-center fw-bold text-primary">{item.bien_kiem_soat}</TableCell>
                    <TableCell className="text-center">{item.nguoi_quan_ly}</TableCell>
                    <TableCell className="text-justify">{item.nguyen_nhan_hu_hong}</TableCell>
                    <TableCell className="text-justify">{item.bien_phap_thuc_hien}</TableCell>
                    <TableCell className="text-justify">{item.de_xuat}</TableCell>
                    <TableCell className="text-right fw-bold">
                      {item.du_tru_kinh_phi ? Number(item.du_tru_kinh_phi).toLocaleString("vi-VN") : "0"}
                    </TableCell>
                    <TableCell align="center">
                      <span className={`badge-status ${isFinished ? 'bg-success text-white' : 'bg-warning text-dark'}`} style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                        {item.ket_qua || 'Đang xử lý'}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredItems.length > 0 && (
          <Paper elevation={0} sx={{ mt: 2, p: 2.5, borderRadius: 3, border: '1px solid #e2e8f0', backgroundColor: '#fff', textAlign: 'right' }}>
            <Typography sx={{ fontWeight: 600, color: '#64748b' }}>
              TỔNG CỘNG: <span style={{ fontSize: '1.4rem', color: '#ef4444', marginLeft: '10px' }}>{totalKinhPhi.toLocaleString("vi-VN")} VNĐ</span>
            </Typography>
            <Typography sx={{ mt: 0.5, fontStyle: 'italic', color: '#94a3b8' }}>
              {docSoThanhChu(totalKinhPhi)}
            </Typography>
          </Paper>
        )}
      </Box>
    </main>
  );
};

export default PhuongTienHuHong;