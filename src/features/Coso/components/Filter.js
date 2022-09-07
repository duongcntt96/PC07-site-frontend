import React from "react";

const Filter = ({
  title,
  name,
  target,
  filters,
  handleChange,
  handleClick = (e) => {},
}) => {
  return (
    <div className="filter-item">
      <select
        className="form-control"
        name={name}
        value={target[name] || ""}
        onChange={(e) => {
          handleChange(e);
        }}
        onClick={(e) => {
          handleClick(e);
        }}
      >
        <option value="">{target[name] ? "Tất cả" : title}</option>
        {filters.map((item, i) => (
          <option value={item.id} key={i}>
            {/* {"-".repeat(item?.maso?.length | 0) + " "} */}
            {item?.maso?.length ? item.maso + " - " : ""}
            {item.ten.length > 60
              ? item.ten.substring(0, 82) + "..."
              : item.ten}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filter;
