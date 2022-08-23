import phuongtienApi from "api/phuongtienApi";
import React, { useEffect, useState } from "react";
import LazyLoad from "react-lazyload";
import PhuongtienItem from "./components/PhuongtienItem";

const PhuongtienList = ({ data, filter }) => {
  const { id, ten } = data;

  const [phuongtien, setPhuongtien] = useState([]);

  useEffect(() => {
    setPhuongtien([]);
    const params = { ...filter, chung_loai: id, size: 100 };
    const getPhuongtien = async () => {
      const rp = await phuongtienApi.getAll(params);
      setPhuongtien(rp.data);
    };
    getPhuongtien();
  }, [filter]);

  return (
    <>
      {phuongtien.length > 0 && (
        <div key={id} className="pt-list">
          <h3>{phuongtien[0].chung_loai__ten}</h3>
          <div className="pt-container">
            {phuongtien.map((item) => {
              return (
                <LazyLoad key={item.id} placeholder={<h5>Loading...</h5>}>
                  <PhuongtienItem {...item} />
                </LazyLoad>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export { PhuongtienList };
