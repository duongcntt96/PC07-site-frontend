import { closeSubMenu, openSubMenu } from "components/SubMenu/subMenuSlice";
import User from "components/User";
import React, { useRef, useState } from "react";
import { FaBars } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.jpg";
import banner from "../../assets/images/banner.jpg";

import { links } from "../../data";

const Navbar = () => {
  const linksContainerRef = useRef(null);
  const linksRef = useRef(null);
  const dispatch = useDispatch();

  const [showLinks, setShowLinks] = useState(false);

  // useEffect(() => {
  //   const linksHeight = linksRef.current.getBoundingClientRect().height;
  //   if (showLinks) linksContainerRef.current.style.height = `${linksHeight}px`;
  //   else linksContainerRef.current.style.height = "0px";
  // }, [showLinks]);

  const displaySubmenu = (e) => {
    const sublink = links.find((link) => link.text === e.target.textContent);
    const tmpPositon = e.target.getBoundingClientRect();
    const center = (tmpPositon.left + tmpPositon.right) / 2;
    const bottom = tmpPositon.bottom;
    const action = openSubMenu({
      data: sublink.children,
      position: { center, bottom },
    });
    dispatch(action);
  };

  const handleMouseOver = (e) => {
    if (!e.target.classList.contains("link")) {
      const action = closeSubMenu();
      dispatch(action);
    }
  };

  return (
    <>
      <div className="banner">
        <img src={banner} alt="" width="100%" />
      </div>
      <nav onMouseOver={(e) => handleMouseOver(e)}>
        <div className="nav-center">
          <div className="nav__header">
            <Link to="/home">
              <img className="logo" src={logo} alt="logo" />
            </Link>
            <button
              className="nav__toggle"
              onClick={() => setShowLinks(!showLinks)}
            >
              <FaBars />
            </button>
          </div>

          <div className="nav__links" ref={linksContainerRef}>
            <ul className="links" ref={linksRef}>
              {links.map((link) => {
                const { id, url, text } = link;
                return (
                  <li key={id}>
                    <Link
                      className="link"
                      to={url}
                      onMouseOver={(e) => displaySubmenu(e)}
                    >
                      {text}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <User />
          </div>
          {/* <ul className="social-icons">
          {social.map((link) => {
            const { id, url, icon } = link;
            return (
              <li key={id}>
                <a href={url} target="_blank" rel="noreferrer">
                  {icon}
                </a>
              </li>
            );
          })}
        </ul> */}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
