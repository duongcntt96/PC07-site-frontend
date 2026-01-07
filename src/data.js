import React from "react";
import { BsCardChecklist, BsPersonCheck } from "react-icons/bs";
import { GoReport, GoLaw } from "react-icons/go";
import { SiReadthedocs } from "react-icons/si";
import { IoLibrarySharp } from "react-icons/io5";
import { FcDepartment } from "react-icons/fc";
import { RiExchangeFundsFill } from "react-icons/ri";
import { TiExportOutline  } from "react-icons/ti";
import { CgImport    } from "react-icons/cg";
import { FaChartPie } from "react-icons/fa";
import { AiOutlineSchedule  } from "react-icons/ai";
import { FaBehance, FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";

export const rootAPI = "http://localhost:8000/api/";

export const links = [
  {
    id: 1,
    active: true,
    url: "/qlpt",
    text: "THỰC LỰC",
    children: [
      {
        id: 1,
        url: "/qlpt",
        text: "Thực lực phương tiện",
        icon: <BsCardChecklist />,
      },
      {
        id: 2,
        url: "/qlpt/xuatnhap",
        text: "Lịch sử biến động",
        icon: <RiExchangeFundsFill />,
      },
      {
        id: 3,
        url: "/qlpt/xuatnhap/import",
        text: "Nhập phương tiện",
        icon: <CgImport  />,
      },
      {
        id: 4,
        url: "/qlpt/xuatnhap/export",
        text: "Xuất/Điều chuyển phương tiện",
        icon: <TiExportOutline  />,
      },
      {
        id: 6,
        url: "/qlpt/baocao",
        text: "Báo cáo",
        icon: <GoReport />,
      },
      {
        id: 7,
        url: "/thuvien?linh_vuc=1",
        text: "Văn bản, tài liệu",
        icon: <SiReadthedocs />,
      },
    ],
  },
  {
    id: 2,
    active: true,
    url: "/qlpt/huhong",
    text: "BẢO DƯỠNG, SỬA CHỮA",
    children: [
      {
        id: 1,
        url: "/qlpt/huhong",
        text: "Theo dõi phương tiện hư hỏng",
        icon: <FaChartPie />,
      },
      {
        id: 2,
        url: "/qlpt/huhong/add",
        text: "Báo cáo phương tiện hư hỏng",
        icon: <IoLibrarySharp />,
      },
      {
        id: 3,
        url: "/qlpt/dangkiem",
        text: "Lịch đăng kiểm",
        icon: <AiOutlineSchedule  />,
      },
    ],
  },
  {
    id: 3,
    active: true,
    url: "/nhattrinh",
    text: "NHẬT TRÌNH",
    children: [
      {
        id: 1,
        url: "/nhattrinh",
        text: "Nhật trình hoạt động",
        icon: <GoLaw />,
      },
      {
        id: 2,
        url: "/nhattrinh",
        text: "Thêm lịch trình",
        icon: <IoLibrarySharp />,
      },
    ],
  },
  {
    id: 3,
    active: true,
    url: "/tspl",
    text: "THƯ VIỆN",
    children: [
      {
        id: 1,
        url: "/tspl",
        text: "Tủ sách pháp luật",
        icon: <GoLaw />,
      },
      {
        id: 2,
        url: "/tlnv",
        text: "Tài liệu",
        icon: <IoLibrarySharp />,
      },
    ],
  },
];

export const social = [
  {
    id: 1,
    url: "https://www.facebook.com",
    icon: <FaFacebook />,
  },
  {
    id: 2,
    url: "https://www.twitter.com",
    icon: <FaTwitter />,
  },
  {
    id: 3,
    url: "https://www.linkedin.com",
    icon: <FaLinkedin />,
  },
  {
    id: 4,
    url: "https://www.behance.net",
    icon: <FaBehance />,
  },
];
