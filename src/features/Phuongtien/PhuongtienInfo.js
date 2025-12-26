import phuongtienApi from "api/phuongtienApi";

import { closeSubMenu } from "components/SubMenu/subMenuSlice";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import ImageSlide from "components/ImageSlide";
import InfoItem from "./components/InfoItem";
import { RiPlayListAddFill } from "react-icons/ri";
import { showModal } from "components/Modal/modalSlice";
import Loading from "components/Loading";

const PhuongtienInfo = () => {
  const dispatch = useDispatch();
  const loadMoreRef = useRef(null);

  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [info, setInfo] = useState({});
  const [loadingMore, setLoadingMore] = useState(false);
  const [image, setImage] = useState([]);
  const [children, setChildren] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, size: 20, count: 0 });

  // fetch children (next page)
  const fetchChildren = useCallback(async () => {
    if (loadingMore) return;
    const { page, size, count } = pagination;
    if (children.length >= count && count !== 0) return;

    try {
      setLoadingMore(true);
      const resp = await phuongtienApi.getAll({ page, size, noi_bo_tri: id });
      const nextData = Array.isArray(resp.data) ? resp.data : [];
      setChildren((prev) => [...prev, ...nextData]);
      setPagination((prev) => ({
        ...prev,
        page: (prev.page || 1) + 1,
        count: resp.pagination?.count || resp.pagination?.total || prev.count,
      }));
    } catch (err) {
      console.error("Failed to fetch children", err);
    } finally {
      setLoadingMore(false);
    }
  }, [id, loadingMore, pagination, children.length]);

  // IntersectionObserver for infinite scroll; more efficient than scroll listener
  useEffect(() => {
    if (!loadMoreRef.current) return;
    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fetchChildren();
          }
        });
      },
      { root: null, rootMargin: "200px", threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [fetchChildren]);

  useEffect(() => {
    // reset data when id changes and load initial info & children in parallel
    let mounted = true;

    setInfo({});
    setChildren([]);
    setPagination({ page: 1, size: 20, count: 0 });
    setLoading(true);

    const load = async () => {
      try {
        const [respInfo, respImages, respChildren] = await Promise.all([
          phuongtienApi.get(id),
          phuongtienApi.getListImage({ phuong_tien: id }),
          phuongtienApi.getAll({ page: 1, size: 20, noi_bo_tri: id }),
        ]);

        if (!mounted) return;

        setInfo(respInfo);
        setImage(respImages.data || []);
        setChildren(Array.isArray(respChildren.data) ? respChildren.data : []);
        setPagination((prev) => ({
          ...prev,
          page: 2,
          count: respChildren.pagination?.count || respChildren.pagination?.total || prev.count,
        }));
      } catch (err) {
        console.error("Failed to load phuongtien info", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [id]);

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
                  try {
                    const data = new FormData();
                    data.append("hinh_anh", e.target.files[0]);
                    data.append("phuong_tien", id);
                    await phuongtienApi.addImage(data);
                  } catch (err) {
                    console.error("Upload image failed", err);
                  }
                }}
              />
            </div>
            {info && info.id ? <InfoItem {...info} /> : null}
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

          <table className="table" ref={loadMoreRef}>
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
                const { ten, so_luong, don_vi_tinh, id: ptId } = pt;
                return (
                  <tr key={ptId || index}>
                    <th scope="row">{index + 1}</th>
                    <td>
                      <Link to={`/phuongtien/${ptId}`}>{ten}</Link>
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
  return <Loading />;
};

export { PhuongtienInfo };
export default PhuongtienInfo;
