
const VNDFormat = (val) => {
  if (!val) return "";
  while (/(\d+)(\d{3})/.test(val.toString())) {
    val = val.toString().replace(/(\d+)(\d{3})/, "$1,$2");
  }
  return val + " đ";
};

const LocalDateFormat = (val) => {
  if (val == null) return "";
  const time = new Date(val);
  return time.toLocaleDateString("vi");
};

const treeOptionsConvert = (tree, level = 0) => {
  let option = [];
  tree.forEach(e => {
    option.push({ ...e, level });
    if (e.children?.length) {
      option = option.concat(treeOptionsConvert(e.children, level + 1));
    }
  });
  return option;
};

const swapItems = (arr, index1, index2) => {
  const newArr = [...arr];
  newArr[index1] = newArr.splice(index2, 1, newArr[index1])[0];
  return newArr;
};

export {
  treeOptionsConvert,
  VNDFormat,
  LocalDateFormat,
  swapItems
};
