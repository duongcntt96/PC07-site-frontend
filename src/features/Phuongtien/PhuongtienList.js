import chungloaiApi from "api/chungloaiApi";
import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import React, { useEffect, useState } from "react";
import LazyLoad from "react-lazyload";
import { useDispatch } from "react-redux";
import PhuongtienItem from "./components/PhuongtienItem";

const PhuongtienList = () => {
  const dispatch = useDispatch();
  const [chungLoai, setChungLoai] = useState([]);

  useEffect(() => {
    const params = { size: 100 };
    const getChungLoai = async () => {
      const rp = await chungloaiApi.getAll(params);
      setChungLoai(rp.data);
    };
    getChungLoai();
  }, []);

  return (
    <main onMouseOver={(e) => dispatch(closeSubMenu())}>
      {chungLoai.map((item) => {
        const { ten, phuongtien_list } = item;

        return (
          phuongtien_list.length > 0 && (
            <div className="pt-list">
              <h3>
                {ten}: {phuongtien_list.length}
              </h3>
              <div className="pt-container">
                {phuongtien_list.map((id) => {
                  return (
                    <LazyLoad key={id} placeholder={<h1>Loading...</h1>}>
                      <PhuongtienItem id={id} />
                    </LazyLoad>
                  );
                })}
              </div>
            </div>
          )
        );
      })}
    </main>
  );
};

export { PhuongtienList };
