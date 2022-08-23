import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const SubMenu = () => {
  const container = useRef(null);
  const { isShowing, position, data } = useSelector((state) => state.subMenu);

  useEffect(() => {
    // const root = document.querySelector("#root").getBoundingClientRect();
    container.current.style.left = `${position.center}px`;
    container.current.style.top = `${position.bottom}px`;
  });

  return (
    <div className={isShowing ? "submenu show" : "submenu"} ref={container}>
      <ul>
        {data.map((link, i) => {
          if (link.icon)
            return (
              <li key={i}>
                <Link to={link.url}>
                  {link.icon}
                  {"  " + link.text}
                </Link>
              </li>
            );
          return (
            <li key={i}>
              <Link to={link.url}>{link.text}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SubMenu;
