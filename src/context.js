import React, { useState, useContext } from "react";

const AppContext = React.createContext(null);

const AppProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [subMenuData, setSubMenuData] = useState([]);
  const [position, setPosition] = useState({});

  const openSubMenu = (data, position) => {
    if (data != null) setSubMenuData(data);
    else setSubMenuData([]);
    setPosition(position);
    setIsSubMenuOpen(true);
  };
  const closeSubMenu = () => {
    // alert("Close Sub");
    setIsSubMenuOpen(false);
  };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const login = (e, username, password) => {
    e.preventDefault();
    alert("Login with username: " + username + " and password: " + password);
  };

  return (
    <AppContext.Provider
      value={{
        position,
        subMenuData,
        isSubMenuOpen,
        openSubMenu,
        closeSubMenu,
        isModalOpen,
        openModal,
        closeModal,
        login,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppContext, AppProvider };
