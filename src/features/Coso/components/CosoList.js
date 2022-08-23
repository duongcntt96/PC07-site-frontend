import cosoApi from "api/cosoApi";
import React, { useEffect, useState } from "react";
import LazyLoad from "react-lazyload";
import CosoItem from "./CosoItem";

const CosoList = ({ filter }) => {
  const [diaban, setDiaban] = useState([]);
  const [coso, setCoso] = useState([]);
  useEffect(() => {
    setCoso([]);
    const getPhuongtien = async () => {
      const params = { ...filter, size: 100 };
      setCoso(await (await cosoApi.getAll(params)).data);
      setDiaban(await (await cosoApi.getListDiaban()).data);
      // coso.sort((a, b) => b.id - a.id);
    };
    getPhuongtien();
  }, [filter]);

  return (
    <>
      <div className="pt-list">
        {diaban.map((e) => (
          <>
            <h3>{e.ten}</h3>
            <div className="pt-container">
              {coso
                .filter((i) => i.diaban === e.ten)
                .map((item) => {
                  return (
                    <LazyLoad key={item.id} placeholder={<h5>Loading...</h5>}>
                      <CosoItem {...item} />
                    </LazyLoad>
                  );
                })}
            </div>
          </>
        ))}
      </div>
    </>
  );
};

export { CosoList };
