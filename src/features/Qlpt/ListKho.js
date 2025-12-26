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
      const { data: khoData } = await qlptApi.getListKho();
      const { data: chungloaiData } = await qlptApi.getListChungloai();
      setKho(khoData);
      setChungloai(chungloaiData);
    }; 
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: list_PT } = await qlptApi.getListPhuongtien({ ...filters });
      setListPT(Array.isArray(list_PT) ? list_PT : []);
      setLoading(false);
    };
    fetchData();
    pushURL(filters);
  }, [filters]);

  useEffect(() => {
    // Normalize listPT to an array in case API returns unexpected shapes
    const listPTArray = Array.isArray(listPT) ? listPT : [];

    const getChild = (item) => {
      // populate children and ensure arrays exist
      item.chungloai = chungloai.filter((f) => f.parent == item.id) || [];
      item.chungloai.forEach((e) => getChild(e));

      item.phuongtien = listPTArray.filter((f) => {
        return f.chung_loai === item.id;
      });

      item.totals = () => {
        let totals = 0;
        (item.phuongtien || []).forEach((e) => (totals += e.totals || e.totals));
        (item.chungloai || []).forEach((e) => (totals += e.totals()));
        return totals;
      };

      item.count = () => {
        let totals = 0;
        (item.chungloai || []).forEach((e) => (totals += e.count()));
        return totals + (item.phuongtien ? item.phuongtien.length : 0);
      };

      return;
    };

    // Build tree from root nodes (those without parent)
    const roots = chungloai.filter((c) => !c.parent && c !== undefined) || [];
    roots.forEach((r) => getChild(r));
    setTree(roots);
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
