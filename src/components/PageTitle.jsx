import React, { useEffect } from "react";

/**
 * Lightweight helper to set the page title without external libs
 * Replaces react-helmet usage to avoid JSX typing errors
 */
const PageTitle = ({ title }) => {
  useEffect(() => {
    if (typeof title === "string" && title.length > 0) document.title = title;
  }, [title]);

  return null;
};

export default PageTitle;
