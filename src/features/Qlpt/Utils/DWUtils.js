
const VNDFormat = (val) => {
  if (!val) return "";
  while (/(\d+)(\d{3})/.test(val.toString())) {
    val = val.toString().replace(/(\d+)(\d{3})/, "$1" + "," + "$2");
  }
  return val + " đ";
};

const docSoThanhChu = (function () {
  const ChuSo = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];
  const Tien = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ"];

  function docSoBaChuSo(baso) {
    let trăm = Math.floor(baso / 100);
    let chục = Math.floor((baso % 100) / 10);
    let đơnvị = baso % 10;
    let kếtquả = "";
    if (trăm === 0 && chục === 0 && đơnvị === 0) return "";
    if (trăm !== 0) {
      kếtquả += ChuSo[trăm] + " trăm ";
      if (chục === 0 && đơnvị !== 0) kếtquả += "lẻ ";
    }
    if (chục !== 0 && chục !== 1) {
      kếtquả += ChuSo[chục] + " mươi ";
      if (chục === 0 && đơnvị !== 0) kếtquả = kếtquả + "lẻ ";
    }
    if (chục === 1) kếtquả += "mười ";
    switch (đơnvị) {
      case 1:
        kếtquả += (chục !== 0 && chục !== 1) ? "mốt " : "một ";
        break;
      case 5:
        kếtquả += (chục === 0) ? "năm " : "lăm ";
        break;
      default:
        if (đơnvị !== 0) kếtquả += ChuSo[đơnvị] + " ";
        break;
    }
    return kếtquả;
  }

  return function (sốtiền) {
    if (sốtiền === 0) return "Không đồng";
    if (sốtiền < 0) return "Số tiền âm";
    let s = sốtiền.toString();
    let i = 0;
    let kếtquả = "";
    let vịtrí = [];
    if (isNaN(sốtiền)) return "";
    
    let n = s.length;
    while (n > 0) {
      vịtrí.push(s.substring(Math.max(0, n - 3), n));
      n -= 3;
    }
    for (i = vịtrí.length - 1; i >= 0; i--) {
      let tmp = docSoBaChuSo(parseInt(vịtrí[i]));
      if (tmp !== "") kếtquả += tmp + Tien[i] + " ";
    }
    return kếtquả.trim().charAt(0).toUpperCase() + kếtquả.trim().slice(1) + " đồng";
  };
})();
export { VNDFormat, docSoThanhChu };
