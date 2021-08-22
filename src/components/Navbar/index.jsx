import { decode } from "base-64";
import { closeSubMenu, openSubMenu } from "components/SubMenu/subMenuSlice";
import React, { useEffect, useRef, useState } from "react";
import { FaBars } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logo.jpg";
import { links, social } from "../../data";

const Navbar = () => {
  const linksContainerRef = useRef(null);
  const linksRef = useRef(null);
  const dispatch = useDispatch();

  const [showLinks, setShowLinks] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const linksHeight = linksRef.current.getBoundingClientRect().height;
    if (showLinks) linksContainerRef.current.style.height = `${linksHeight}px`;
    else linksContainerRef.current.style.height = "0px";
  }, [showLinks]);

  useEffect(() => {
    const token = localStorage.getItem("secret");
    if (token) {
      console.log(token);
      const { access } = JSON.parse(token);
      if (access) {
        const accessInfo = JSON.parse(decode(access.split(".")[1]));
        console.log("get username success", accessInfo.name);
        setUsername(accessInfo.name);
      }
    }
  }, []);

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
    if (!e.target.classList.contains("link-item")) {
      const action = closeSubMenu();
      dispatch(action);
    }
  };

  return (
    <nav onMouseOver={(e) => handleMouseOver(e)}>
      <div className="nav-center">
        <div className="nav-header">
          <Link to="/home">
            <img className="logo" src={logo} alt="logo" />
          </Link>
          <button
            className="nav-toggle"
            onClick={() => setShowLinks(!showLinks)}
          >
            <FaBars />
          </button>
        </div>

        <div className="links-container" ref={linksContainerRef}>
          <ul className="links" ref={linksRef}>
            {links.map((link) => {
              const { id, url, text } = link;
              return (
                <li key={id}>
                  <Link
                    className="link-item"
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

        <ul className="social-icons">
          <span>{username}</span>
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
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
