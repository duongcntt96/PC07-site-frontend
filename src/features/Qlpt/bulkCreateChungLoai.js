import React, { useState } from 'react';
import { 
  Button, Box, Paper, Typography, Table, TableBody, 
  TableCell, TableContainer, TableHead, TableRow, Stack, Alert 
} from '@mui/material';
import * as XLSX from 'xlsx';
import qlptApi from "api/qlptApi"; // Giả định bạn đã có hàm bulkCreate
export const BulkCreateChungLoai = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Hàm đọc File Excel
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const workbook = XLSX.read(event.target.result, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      
      // Map lại dữ liệu theo đúng field của Model
      const formattedData = jsonData.map(item => ({
        ten: item['Tên'] || item['ten'],
        parent_maso: item['Mã cha'] || item['maso_cha'] || null,
      }));
      setData(formattedData);
    };
    reader.readAsBinaryString(file);
  };

  // 2. Hàm gửi dữ liệu lên Server
  const handleSubmit = async () => {
    setLoading(true);
    try {
      await qlptApi.bulkCreateChungLoai(data);
      alert("Thêm hàng loạt thành công!");
      setData([]); // Reset sau khi thành công
    } catch (error) {
      console.error("Lỗi khi import:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>Nhập chủng loại từ Excel</Typography>
      
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <Button variant="contained" component="label">
          Chọn file Excel
          <input type="file" hidden accept=".xlsx, .xls" onChange={handleFileUpload} />
        </Button>
        
        {data.length > 0 && (
          <Button variant="contained" color="success" onClick={handleSubmit} disabled={loading}>
            {loading ? "Đang lưu..." : `Lưu ${data.length} dòng vào hệ thống`}
          </Button>
        )}
      </Stack>

      {data.length > 0 ? (
        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: '#1e293b', color: '#fff' }}>Tên chủng loại</TableCell>
                <TableCell sx={{ bgcolor: '#1e293b', color: '#fff' }}>Mã nhóm cha (Nếu có)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell>{row.ten}</TableCell>
                  <TableCell>{row.parent_maso || <Typography variant="caption" color="text.disabled">Nhóm gốc</Typography>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Alert severity="info">Vui lòng chọn file Excel có cột "Tên" và "Mã cha" để bắt đầu.</Alert>
      )}
    </Box>
  );
};