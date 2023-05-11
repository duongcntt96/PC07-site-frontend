import qlptApi from "api/qlptApi";
import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Filter from "features/Coso/components/Filter";
import Item from "./components/Item";
import { pushURL } from "./Utils/DWUtils";
import Loading from "components/Loading";
import { useLocation } from "react-router-dom";

const ListKho = () => {
  const paramsURL = new URLSearchParams(window.location.search);

  console.log("====================================");
  console.log(useLocation());
  console.log("====================================");

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const [filters, setValues] = useState({
    chung_loai: paramsURL.get("chung_loai"),
    kho_nhap: paramsURL.get("kho_nhap"),
  });

  const [kho, setKho] = useState([]);
  const [chungloai, setChungloai] = useState([]);
  const [listPT, setListPT] = useState([]);
  const [tree, setTree] = useState([]);
  const [isTreeShowing, setIsTreeShowing] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setKho(await (await qlptApi.getListKho()).data);
      setChungloai(await (await qlptApi.getListChungloai()).data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const list_PT = await qlptApi.getListPhuongtien({ ...filters });
      setListPT(list_PT.data);
      setLoading(false);
    };
    fetchData();
    pushURL(filters);
  }, [filters]);

  useEffect(() => {
    const getChild = (item) => {
      item.chungloai = chungloai.filter((f) => f.parent == item.id);
      item.chungloai.map((e) => getChild(e));
      item.totals = () => {
        let totals = 0;
        item.phuongtien.map((e) => (totals += e.totals));
        item.chungloai.map((e) => (totals += e.totals()));
        return totals;
      };
      item.count = () => {
        let totals = 0;
        item.chungloai.map((e) => (totals += e.count()));
        return totals + item.phuongtien.length;
      };
      item.phuongtien = listPT.filter((f) => {
        return f.chung_loai === item.id;
      });
      return;
    };
    console.log(chungloai);
    getChild(chungloai);
    setTree(chungloai.chungloai);
  }, [listPT, chungloai]);

  const handleChange = (e) => {
    setValues({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <main onMouseOver={(e) => dispatch(closeSubMenu())}>
      <div className="pt-header">
        <Filter
          title="Lọc theo kho"
          name="kho_nhap"
          target={filters}
          filters={kho}
          handleChange={handleChange}
        />
        <Filter
          title="Lọc theo chủng loại"
          name="chung_loai"
          target={filters}
          filters={chungloai}
          handleChange={handleChange}
        />
      </div>

      <ul id="tree">
        <li>
          <h5>
            <span
              onClick={() => setIsTreeShowing(!isTreeShowing)}
              style={{ cursor: "pointer" }}
              className="unselectable"
            >
              {loading ? (
                <Loading />
              ) : (
                `Tìm thấy ${listPT.length} loại phương tiện ${
                  filters.kho_nhap
                    ? "tại " + kho.find((e) => e.id == filters.kho_nhap).ten
                    : ""
                }`
              )}
            </span>
          </h5>
          <br />
          <ul className={`${isTreeShowing ? "nested active" : "nested"}`}>
            {tree.map((e, i) => (
              <Item e={e} key={i} />
            ))}
          </ul>
        </li>
      </ul>
    </main>
  );
};

export { ListKho };
