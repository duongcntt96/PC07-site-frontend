import phuongtienApi from "api/phuongtienApi";

import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import ImageSlide from "components/ImageSlide";
import InfoItem from "./components/InfoItem";
import { RiPlayListAddFill } from "react-icons/ri";
import { showModal } from "components/Modal/modalSlice";

const PhuongtienInfo = () => {
  const dispatch = useDispatch();
  const refList = useRef(null);

  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState({});
  const [loadMore, setLoadMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [image, setImage] = useState([]);
  const [children, setChildren] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 20,
    count: 21,
  });

  const scrollListener = () => {
    if (refList.current !== null) {
      console.log("Listener");
      const isLoadMore =
        refList.current.clientHeight + refList.current.offsetTop <
        window.scrollY + window.innerHeight;
      if (isLoadMore && !loadMore) {
        setLoadMore(true);
      }
    }
  };

  const getChildren = async () => {
    if (!loadMore || loadingMore) {
      return;
    }
    setLoadingMore(true);
    console.log("Loadmore:" + loadMore);
    console.log(pagination);
    const { page, count } = pagination;
    if (children.length >= count) {
      window.removeEventListener("scroll", scrollListener, true);
      return;
    }
    const respone = await phuongtienApi.getAll({
      ...pagination,
      noi_bo_tri: id,
    });
    setChildren([...children, ...respone.data]);
    setPagination({ ...respone.pagination, page: page + 1 });
    console.log(respone);
    setLoadingMore(false);
  };

  useEffect(() => {
    getChildren();
    setLoadMore(false);
  }, [loadMore]);

  useEffect(() => {
    // reset data
    setInfo({});
    setChildren([]);
    setPagination({
      page: 1,
      size: 20,
      count: 21,
    });
    setLoading(true);
    setLoadMore(false);
    setLoadingMore(false);

    window.addEventListener("scroll", scrollListener, true);
    getPTInfo();
    getChildren();

    return () => {
      window.removeEventListener("scroll", scrollListener, true);
    };
  }, [id]);

  const getPTInfo = async () => {
    const respone = await phuongtienApi.get(id);
    setInfo(respone);

    setImage((await phuongtienApi.getListImage({ phuong_tien: id })).data);
    setLoading(false);
    // console.log(respone);
  };

  if (!loading) {
    return (
      <main
        onMouseOver={(e) => {
          dispatch(closeSubMenu());
          // dispatch(closeModal());
        }}
      >
        <div className="container">
          <div className="row pt-content">
            <div className="col-sm-6">
              <div>
                <ImageSlide images={image} />
              </div>
              <input
                className="btn"
                type="file"
                name="hinh_anh"
                accept="image/*"
                id="id_hinh_anh"
                onChange={async (e) => {
                  const data = new FormData();
                  data.append("hinh_anh", e.target.files[0]);
                  data.append("phuong_tien", id);
                  await phuongtienApi.addImage(data);
                }}
              />
            </div>
            <InfoItem {...info} />
          </div>

          <div className="row">
            <div className="list-title">
              <h3>Phương tiện đi kèm: </h3>
              <RiPlayListAddFill
                className="btn-add"
                onClick={(e) => {
                  dispatch(showModal({ id }));
                }}
              />
            </div>
          </div>

          <table className="table" ref={refList}>
            <thead>
              <tr>
                <th scope="col">Stt</th>
                <th scope="col">Tên</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Đơn vị tính</th>
              </tr>
            </thead>
            <tbody>
              {children.map((pt, index) => {
                const { ten, so_luong, don_vi_tinh } = pt;
                return (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>
                      <Link to={`/phuongtien/${pt.id}`}>{ten}</Link>
                    </td>
                    <td>{so_luong}</td>
                    <td>{don_vi_tinh}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    );
  }
  return <h1>Loading...</h1>;
};

export { PhuongtienInfo };
export default PhuongtienInfo;
