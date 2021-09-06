import Modal from "components/Modal/Form";
import Scroller from "components/Scroller";
import SubMenu from "components/SubMenu";
import { PhuongtienInfo, PhuongtienList } from "features/Phuongtien";
import { Login, Register } from "features/User";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Home from "./features/Home";
import Tochuc from "./features/Tochuc";

function App() {
  return (
    <Router>
      <Navbar />
      <SubMenu />
      <Switch>
        <Route path="/home">
          <Home />
        </Route>

        <Route path="/user/login">
          <Login />
        </Route>
        <Route path="/user/register">
          <Register />
        </Route>

        <Route exact path="/phuongtien">
          <PhuongtienList />
        </Route>
        <Route path="/phuongtien/:id" component={PhuongtienInfo}>
          {/* <PhuongtienInfo id={id} /> */}
        </Route>

        <Route path="/tochuc">
          <Tochuc />
        </Route>
      </Switch>
      <Modal />
      <Scroller />
      <Footer />
    </Router>
  );
}

export default App;
