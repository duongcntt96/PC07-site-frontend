import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet } from "react-helmet";

// --- Components ---
import Navbar from "./components/Navbar";
import SubMenu from "components/SubMenu";
import Footer from "./components/Footer";
import Scroller from "components/Scroller";

// --- Features: Home & User ---
import Home from "features/Home";
import { Login, Register } from "features/User";
import Profile from "features/User/Profile";

// --- Features: Phuongtien & Qlpt ---
import { ChungloaiList, PhuongtienInfo } from "features/Phuongtien";
import { Phuongtien } from "features/Qlpt/Phuongtien";
import {
  FormAddPhuongTien,
  FormNhapkho,
  ListKho,
  Nhapkho
} from "features/Qlpt";
import { FormXuatkho } from "features/Qlpt/FormXuatkho";

// --- Features: Tochuc & Coso ---
import Tochuc from "features/Tochuc";
import Person from "features/Tochuc/Person";
import Coso from "features/Coso/Coso";
import { Diaban } from "features/Coso";
import { Paper } from "@mui/material";

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <SubMenu />

        <Paper sx={{ minHeight: '620px', p: 2, boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',}}>
                

        <Routes>
          {/* --- Home --- */}
          <Route
            path="/"
            element={
              <>
                <Helmet>
                  <title>Trang chủ</title>
                </Helmet>
                <Home />
              </>
            }
          />

          {/* --- User --- */}
          <Route
            path="/user/login"
            element={
              <>
                <Helmet>
                  <title>Đăng nhập</title>
                </Helmet>
                <Login />
              </>
            }
          />

          <Route
            path="/user/register"
            element={
              <>
                <Helmet>
                  <title>Đăng ký</title>
                </Helmet>
                <Register />
              </>
            }
          />

          <Route path="/user/profile" element={<Profile />} />

          {/* --- QLPT --- */}
          <Route
            path="/qlpt"
            element={
              <>
                <Helmet>
                  <title>Thống kê phương tiện</title>
                </Helmet>
                <ListKho />
              </>
            }
          />

          <Route
            path="/qlpt/phuongtien/:id"
            element={
              <>
                <Helmet>
                  <title>Chi tiết phương tiện</title>
                </Helmet>
                <Phuongtien />
              </>
            }
          />

          <Route
            path="/qlpt/xuatnhap"
            element={
              <>
                <Helmet>
                  <title>Thống kê xuất - nhập</title>
                </Helmet>
                <Nhapkho />
              </>
            }
          />

          <Route
            path="/qlpt/xuatnhap/import"
            element={
              <>
                <Helmet>
                  <title>Nhập kho</title>
                </Helmet>
                <FormNhapkho />
              </>
            }
          />

          <Route
            path="/qlpt/xuatnhap/export"
            element={
              <>
                <Helmet>
                  <title>Xuất kho</title>
                </Helmet>
                <FormXuatkho />
              </>
            }
          />

          <Route
            path="/qlpt/xuatnhap/addPT"
            element={
              <>
                <Helmet>
                  <title>Thêm phương tiện mới</title>
                </Helmet>
                <FormAddPhuongTien />
              </>
            }
          />

          <Route
            path="/qlpt/xuatnhap/:id"
            element={
              <>
                <Helmet>
                  <title>Chỉnh sửa phiếu nhập kho</title>
                </Helmet>
                <FormNhapkho />
              </>
            }
          />

          {/* --- Phuong Tien --- */}
          <Route
            path="/phuongtien"
            element={
              <>
                <Helmet>
                  <title>Phương tiện</title>
                </Helmet>
                <ChungloaiList />
              </>
            }
          />

          <Route path="/phuongtien/:id" element={<PhuongtienInfo />} />

          {/* --- Co So --- */}
          <Route
            path="/coso"
            element={
              <>
                <Helmet>
                  <title>Quản lý cơ sở</title>
                </Helmet>
                <Diaban />
              </>
            }
          />

          <Route
            path="/coso/:id"
            element={
              <>
                <Helmet>
                  <title>Thông tin cơ sở</title>
                </Helmet>
                <Coso />
              </>
            }
          />

          {/* --- To Chuc --- */}
          <Route
            path="/tochuc"
            element={
              <>
                <Helmet>
                  <title>Bộ máy tổ chức</title>
                </Helmet>
                <Tochuc />
              </>
            }
          />

          <Route path="/tochuc/person/:id" element={<Person />} />
        </Routes>

        </Paper>

        <Scroller />
      </BrowserRouter>

      <Footer />
    </>
  );
};

export default App;
