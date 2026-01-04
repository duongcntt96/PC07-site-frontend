import { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Custom hook to push query params to URL (react-router-dom v6)
 *
 * @returns { pushURL, replaceURL, clearParams }
 */
const usePushURL = () => {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Push or replace query params
   * @param {Object} params
   * @param {Object} options { replace?: boolean }
   */
  const pushURL = useCallback(
    (params = {}, options = {}) => {
      const searchParams = new URLSearchParams(location.search);

      Object.keys(params).forEach((key) => {
        const value = params[key];

        if (value === null || value === undefined || value === "") {
          searchParams.delete(key);
        } else {
          searchParams.set(key, value);
        }
      });

      navigate(
        {
          pathname: location.pathname,
          search: searchParams.toString()
            ? `?${searchParams.toString()}`
            : ""
        },
        { replace: !!options.replace }
      );
    },
    [navigate, location]
  );

  /**
   * Clear all query params
   */
  const clearParams = useCallback(() => {
    navigate(
      {
        pathname: location.pathname,
        search: ""
      },
      { replace: true }
    );
  }, [navigate, location.pathname]);

  return {
    pushURL,
    replaceURL: (params) => pushURL(params, { replace: true }),
    clearParams
  };
};

export default usePushURL;
