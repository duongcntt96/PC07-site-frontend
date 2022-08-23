import Modal from "components/Modal/Form";
import Scroller from "components/Scroller";
import SubMenu from "components/SubMenu";
import { ChungloaiList, PhuongtienInfo } from "features/Phuongtien";
import {
  FormAddPhuongTien,
  FormNhapkho,
  ListKho,
  Nhapkho,
} from "features/Qlpt";

import Person from "features/Tochuc/Person";
import { Login, Register } from "features/User";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./features/Home";
import Tochuc from "./features/Tochuc";
import { Helmet } from "react-helmet";
import Profile from "features/User/Profile";
import { Diaban } from "features/Coso";
import Coso from "features/Coso/Coso";

function App() {
  return (
    <Router>
      <Navbar />
      <SubMenu />
      <Switch>
        <Route path="/home">
          <Helmet>
            <title>Home</title>
          </Helmet>
          <Home />
        </Route>

        <Route path="/user/login">
          <Helmet>
            <title>Đăng nhập</title>
          </Helmet>
          <Login />
        </Route>

        <Route path="/user/register">
          <Helmet>
            <title>Đăng ký</title>
          </Helmet>
          <Register />
        </Route>

        <Route path="/user/profile">
          <Profile />
        </Route>

        <Route exact path="/phuongtien">
          <Helmet>
            <title>Phương tiện</title>
          </Helmet>
          <ChungloaiList />
        </Route>

        <Route exact path="/qlpt">
          <Helmet>
            <title>Quản lý phương tiện</title>
          </Helmet>
          <ListKho />
        </Route>

        <Route exact path="/qlpt/nhapkho">
          <Helmet>
            <title>Nhập kho</title>
          </Helmet>
          <Nhapkho />
        </Route>

        <Route exact path="/qlpt/nhapkho/add">
          <Helmet>
            <title>Tạo phiếu nhập kho mới</title>
          </Helmet>
          <FormNhapkho />
        </Route>

        <Route exact path="/qlpt/nhapkho/addPT">
          <Helmet>
            <title>Thêm phương tiện mới</title>
          </Helmet>
          <FormAddPhuongTien />
        </Route>

        <Route path="/qlpt/nhapkho/:id">
          <Helmet>
            <title>Chỉnh sửa phiếu nhập kho</title>
          </Helmet>
          <FormNhapkho />
        </Route>

        <Route path="/phuongtien/:id">
          <PhuongtienInfo />
        </Route>

        <Route exact path="/coso">
          <Helmet>
            <title>Quản lý cơ sở</title>
          </Helmet>
          <Diaban />
        </Route>

        <Route path="/coso/:id">
          <Helmet>
            <title>Thông tin cơ sở</title>
          </Helmet>
          <Coso />
        </Route>

        <Route path="/tochuc" exact>
          <Helmet>
            <title>Bộ máy tổ chức</title>
          </Helmet>
          <Tochuc />
        </Route>

        <Route path="/tochuc/person/:id">
          <Person />
        </Route>
      </Switch>
      <Modal />
      <Scroller />
      <Footer />
    </Router>
  );
}

export default App;
