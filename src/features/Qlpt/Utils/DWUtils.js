import { createBrowserHistory } from "history";

const history = createBrowserHistory();

const pushURL = (filters) => {
  const queryParams = new URLSearchParams();
  for (let a in filters) {
    if (filters[a]) {
      queryParams.set(a, filters[a]);
    }
  }
  const stringParams = queryParams.toString();
  history.push({
    pathname: `${window.location.pathname}${
      stringParams ? "?" : ""
    }${stringParams}`,
  });
};

const VNDFormat = (val) => {
  if (!val) return "";
  while (/(\d+)(\d{3})/.test(val.toString())) {
    val = val.toString().replace(/(\d+)(\d{3})/, "$1" + "," + "$2");
  }
  return val + " đ";
};
export { pushURL, VNDFormat };
