import React from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./features/Home";
import Phuongtien from "./features/Phuongtien";
import Tochuc from "./features/Tochuc";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SubMenu from "components/SubMenu";
import PhuongtienList from "features/Phuongtien/components/PhuongtienList";
import PhuongtienInfo from "features/Phuongtien/components/PhuongtienInfo";

function App() {
  return (
    <Router>
      <Navbar />
      <SubMenu />
      <Switch>
        <Route path="/home">
          <Home />
        </Route>

        <Route exact path="/phuongtien">
          <Phuongtien />
        </Route>
        <Route exact path="/phuongtien/list">
          <PhuongtienList />
        </Route>
        <Route path="/phuongtien/:id" component={PhuongtienInfo}>
          {/* <PhuongtienInfo id={id} /> */}
        </Route>

        <Route path="/tochuc">
          <Tochuc />
        </Route>
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
