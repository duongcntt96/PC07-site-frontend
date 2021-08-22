import personApi from "api/personApi";
import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const Tochuc = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [listPT, setListPT] = useState([]);

  useEffect(() => {
    const fetchListPT = async () => {
      try {
        const params = { page: 1, size: 12 };
        const response = await personApi.getAll(params);
        console.log("Respone: ", response);
        setListPT(response.data);
        setLoading(false);
      } catch (error) {
        alert("Canot connect to Server");
        console.log("Không lấy được dữ liệu", error);
      }
    };
    fetchListPT();
  }, []);

  return (
    <main onMouseOver={(e) => dispatch(closeSubMenu())}>
      <h3>Tổ chức</h3>
      <ul className="pt-container">
        {loading && <li>Loading...</li>}
        {listPT.map((pt) => {
          const { id, ten, chung_loai, nhan_hieu } = pt;
          return (
            <li className="pt-items" key={id}>
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

export default Tochuc;
