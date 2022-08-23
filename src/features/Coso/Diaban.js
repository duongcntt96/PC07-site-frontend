import cosoApi from "api/cosoApi";
import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import React, { useEffect, useState } from "react";
import LazyLoad from "react-lazyload";
import { useDispatch } from "react-redux";
import CosoItem from "./components/CosoItem";
import Filter from "./components/Filter";

const Diaban = () => {
  const dispatch = useDispatch();
  const params = new URLSearchParams(window.location.search);

  const [loading, setLoading] = useState(true);

  const [loaihinhcoso, setLoaihinhcoso] = useState([]);
  const [diaban, setDiaban] = useState([]);
  const [filters, setFilters] = useState({
    dia_ban: params.get("dia_ban"),
    loai_hinh_co_so: params.get("loai_hinh_co_so"),
    dang_hoat_dong: params.get("dang_hoat_dong"),
    thuoc_phu_luc_2: params.get("thuoc_phu_luc_2"),
  });

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      if (!loaihinhcoso.length)
        setLoaihinhcoso(await (await cosoApi.getListLoaihinh()).data);

      let dia_ban = diaban.length
        ? [...diaban]
        : await (
            await cosoApi.getListDiaban()
          ).data;
      const cs = await (await cosoApi.getAll({ ...filters, size: 100 })).data;

      dia_ban.forEach((e) => (e.data = cs.filter((i) => i.dia_ban === e.id)));
      console.log(dia_ban);
      setDiaban(dia_ban);
      setLoading(false);
    };
    fetchData();
  }, [filters]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <main onMouseOver={(e) => dispatch(closeSubMenu())}>
      <div style={{ padding: "0 200px", display: loading ? "block" : "none" }}>
        <img
          src="https://cloud.githubusercontent.com/assets/379606/10749832/e3d88020-7c2b-11e5-9a43-42a92fa27d07.gif"
          alt="loading"
        />
      </div>

      <div className="pt-header">
        <Filter
          title="Lọc theo địa bàn"
          name="dia_ban"
          target={filters}
          filters={diaban}
          handleChange={handleChange}
        />
        <Filter
          title="Lọc theo loại hình cơ sở"
          name="loai_hinh_co_so"
          target={filters}
          filters={loaihinhcoso}
          handleChange={handleChange}
        />
      </div>

      {diaban.map((e) => (
        <>
          {e.data.length ? (
            <div className="pt-list">
              <h3>
                {e.ten} ({e.data.length} cơ sở)
              </h3>
              <div className="pt-container">
                {e.data?.map((item) => {
                  return (
                    // <LazyLoad key={item.id} placeholder={<h5>Loading...</h5>}>
                    <CosoItem {...item} />
                    // </LazyLoad>
                  );
                })}
              </div>
            </div>
          ) : null}
        </>
      ))}
    </main>
  );
};

export { Diaban };
