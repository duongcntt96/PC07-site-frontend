import CosoApi from "api/cosoApi";
import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import ImageSlide from "components/ImageSlide";
import PageTitle from "components/PageTitle";

const Coso = () => {
  const dispatch = useDispatch();
  const refList = useRef(null);

  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState({});
  const [loadMore, setLoadMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
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
    const respone = await CosoApi.getAll({
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
    const respone = await CosoApi.get(id);
    setInfo(respone);
    setLoading(false);
    console.log(respone);
  };

  if (!loading) {
    const {
      id,
      ten,
      dia_chi,
      sdt,
      co_quan_quan_ly,
      sdt_co_quan_quan_ly,
      nganh_nghe,
      thuoc_phu_luc_2,
      dang_hoat_dong,
      diaban,
      loaihinhcoso,
    } = info;
    return (
      <main
        onMouseOver={(e) => {
          dispatch(closeSubMenu());
        }}
      >
        <PageTitle title="Thông tin chi tiết!" />

        <div className="container">
          <div className="row pt-content">
            <div className="col-sm-6">
              <div>
                <ImageSlide
                  images={[
                    "hinh_anh",
                    "http://localhost:8000/static/images/upload/default.jpg",
                  ]}
                />
              </div>
            </div>
            <div className="col">
              <div className="alert alert-success" role="alert">
                <div className="alert-heading">
                  <h3>{ten}</h3>
                </div>
                <table>
                  <tbody>
                    <tr>
                      <td>Địa chỉ:</td>
                      <td>
                        <Link to={`/phuongtien/?chung_loai=${dia_chi}`}>
                          {dia_chi}
                        </Link>
                      </td>
                    </tr>
                    <tr>
                      <td>Số điện thoại:</td>
                      <td>{sdt}</td>
                    </tr>
                    <tr>
                      <td>Cơ quan quản lý trực tiếp:</td>
                      <td>{co_quan_quan_ly}</td>
                    </tr>
                    <tr>
                      <td>Số điện thoại:</td>
                      <td>{sdt_co_quan_quan_ly}</td>
                    </tr>
                    <tr>
                      <td>Ngành nghề:</td>
                      <td>{nganh_nghe}</td>
                    </tr>
                    <tr>
                      <td>Phụ lục:</td>
                      <td>{thuoc_phu_luc_2}</td>
                    </tr>
                    <tr>
                      <td>Trạng thái hoạt động:</td>
                      <td>{dang_hoat_dong}</td>
                    </tr>
                    <tr>
                      <td>Địa bàn:</td>
                      <td>{diaban}</td>
                    </tr>
                    <tr>
                      <td>Loại hình cơ sở:</td>
                      <td>{loaihinhcoso}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
  return <h1>Loading...</h1>;
};

export default Coso;
