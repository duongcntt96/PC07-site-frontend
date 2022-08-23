import React, { useState } from "react";

const Item = ({ e }) => {
  const [isTreeShowing, setIsTreeShowing] = useState(true);

  const { ten, parent } = e;

  if (e.totals() || 1)
    return (
      <li>
        <h4
          onClick={() => setIsTreeShowing(!isTreeShowing)}
          className={`${isTreeShowing ? "caret caret-down" : "caret"}`}
        >
          {parent ? ten : ten.toUpperCase()} ({e.count()}) ({e.totals()})
        </h4>
        {e.chungloai.length ? (
          <>
            <ul className={`${isTreeShowing ? "nested active" : "nested"}`}>
              {e.chungloai.map((f) => {
                return <Item e={f} />;
              })}
            </ul>
          </>
        ) : (
          <>
            <ul className={`${isTreeShowing ? "nested active" : "nested"}`}>
              {e.phuongtien.map((pt) => (
                <>
                  {pt.totals ? (
                    <li key={pt.id}>
                      <a href={`qlpt/phuongtien/${pt.id}`}>
                        <span style={{ color: "green" }}>
                          - {pt.ten || pt.phuong_tien__ten}: {pt.totals} chiếc
                        </span>
                      </a>
                    </li>
                  ) : (
                    <></>
                  )}
                </>
              ))}
            </ul>
          </>
        )}
      </li>
    );
  return <></>;
};

export default Item;
