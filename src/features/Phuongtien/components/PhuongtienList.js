import phuongtienApi from "api/phuongtienApi";
import { useGlobalContext } from "context";
import React, { useState, useEffect } from "react";

const PhuongtienList = () => {
  const { closeSubMenu } = useGlobalContext();
  const [loading, setLoading] = useState(true);
  const [listPT, setListPT] = useState([]);

  useEffect(() => {
    const fetchListPT = async () => {
      try {
        const params = { page: 1, size: 12 };
        const response = await phuongtienApi.getAll(params);
        console.log("Respone: ", response);
        setListPT(response.data);
        setLoading(false);
      } catch (error) {
        console.log("Không lấy được dữ liệu", error);
      }
    };
    fetchListPT();
  }, []);

  return (
    <main onMouseOver={(e) => closeSubMenu()}>
      <h3>Phương tiện</h3>
      <ul className="pt-container">
        {loading && <li>Loading...</li>}
        {listPT.map((pt) => {
          const { id, ten, chung_loai, nhan_hieu } = pt;
          return (
            <li
              className="pt-items"
              key={id}
              onClick={() => {
                document.location.href = `/phuongtien/${id}`;
              }}
            >
              <p>{ten}</p>
              <p>{chung_loai}</p>
              <p>{nhan_hieu}</p>
            </li>
          );
        })}
      </ul>
    </main>
  );
};

export default PhuongtienList;
