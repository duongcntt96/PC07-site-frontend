// @ts-nocheck
import Modal from "components/Modal/Form";
import Scroller from "components/Scroller";
import SubMenu from "components/SubMenu";
import { ChungloaiList, PhuongtienInfo } from "features/Phuongtien";
import PhuongTienHuHong from "features/PhuongTienHuHong";
import PhuongtienHuHongForm from "features/PhuongTienHuHong/phuongtienHuHongForm";
import {
  FormAddPhuongTien,
  FormNhapkho,
  ListKho,
  Nhapkho,
} from "features/Qlpt";

import Person from "features/Tochuc/Person";
import { Login, Register } from "features/User";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./features/Home";
import Tochuc from "./features/Tochuc";
import PageTitle from "components/PageTitle";
import Profile from "features/User/Profile";
import { Diaban } from "features/Coso";
import Coso from "features/Coso/Coso";
import { Phuongtien } from "features/Qlpt/Phuongtien";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <SubMenu />
      <Switch>
        <Route path="/home">
          <PageTitle title="Home" />
          <Home />
        </Route>

        <Route path="/user/login">
          <PageTitle title="Đăng nhập" />
          <Login />
        </Route>

        <Route path="/user/register">
          <PageTitle title="Đăng ký" />
          <Register />
        </Route>

        <Route path="/user/profile">
          <Profile />
        </Route>

        <Route exact path="/phuongtien">
          <PageTitle title="Phương tiện" />
          <ChungloaiList />
        </Route>

        <Route exact path="/qlpt">
          <PageTitle title="Quản lý phương tiện" />
          <ListKho />
        </Route>

        <Route exact path="/qlpt/nhapkho">
          <PageTitle title="Nhập kho" />
          <Nhapkho />
        </Route>

        <Route exact path="/qlpt/phuongtien/:id">
          <PageTitle title="Chi tiết phương tiện" />
          <Phuongtien />
        </Route>

        <Route exact path="/qlpt/nhapkho/add">
          <PageTitle title="Tạo phiếu nhập kho mới" />
          <FormNhapkho />
        </Route>

        <Route exact path="/qlpt/nhapkho/addPT">
          <PageTitle title="Thêm phương tiện mới" />
          <FormAddPhuongTien />
        </Route>

        <Route path="/qlpt/nhapkho/:id">
          <PageTitle title="Chỉnh sửa phiếu nhập kho" />
          <FormNhapkho />
        </Route>

        <Route exact path="/phuongtien/huhong">
          <PageTitle title="Phương tiện hư hỏng" />
          <PhuongTienHuHong />
        </Route>

        <Route exact path="/phuongtien/huhong/add">
          <PageTitle title="Thêm phương tiện hư hỏng" />
          <PhuongtienHuHongForm />
        </Route>

        <Route path="/phuongtien/:id">
          <PhuongtienInfo />
        </Route>

        <Route exact path="/coso">
          <PageTitle title="Quản lý cơ sở" />
          <Diaban />
        </Route>

        <Route path="/coso/:id">
          <PageTitle title="Thông tin cơ sở" />
          <Coso />
        </Route>

        <Route path="/tochuc" exact>
          <PageTitle title="Bộ máy tổ chức" />
          <Tochuc />
        </Route>

        <Route path="/tochuc/person/:id">
          <Person />
        </Route>
      </Switch>
      <Modal />
      <Scroller />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
