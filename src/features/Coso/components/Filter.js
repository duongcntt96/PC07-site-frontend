import React from "react";

const Filter = ({
  title,
  name,
  target,
  filters = [],
  handleChange,
  handleClick = (e) => {},
}) => {
  // Normalize filters to an array to avoid runtime crashes when API returns an object or null
  const list = Array.isArray(filters)
    ? filters
    : filters && typeof filters === "object"
    ? Object.values(filters)
    : [];

  if (!Array.isArray(filters)) {
    // Helpful debug log for devs when unexpected data is passed
    console.warn("Filter component expected array for 'filters' prop, got:", filters);
  }

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
        {list.map((item, i) => (
          <option value={item.id} key={i}>
            {/* {"-".repeat(item?.maso?.length | 0) + " "} */}
            {item?.maso?.length ? item.maso + " - " : ""}
            {(item.ten || "").length > 60
              ? (item.ten || "").substring(0, 82) + "..."
              : item.ten || ""}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filter;
