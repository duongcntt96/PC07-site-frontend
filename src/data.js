import React from "react";
import { BsCardChecklist, BsPersonCheck } from "react-icons/bs";
import { GrTransaction } from "react-icons/gr";
import { GoReport, GoLaw } from "react-icons/go";
import { SiReadthedocs } from "react-icons/si";
import { IoLibrarySharp } from "react-icons/io5";
import { FcDepartment } from "react-icons/fc";
import { MdGroup } from "react-icons/md";
import { GiPublicSpeaker, GiTeacher, GiSmallFire } from "react-icons/gi";

import { FaBehance, FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";

export const rootAPI = "http://localhost:8000/api/";

export const links = [
  // {
  //   id: 1,
  //   active: true,
  //   url: "/",
  //   text: "Trang chủ",
  //   children: [],
  // },
  // {
  //   id: 2,
  //   active: true,
  //   url: "/tochuc",
  //   text: "Tổ chức",
  //   children: [
  //     {
  //       id: 1,
  //       url: "/tochuc",
  //       text: "Cơ cấu tổ chức",
  //       icon: <MdGroup />,
  //     },
  //     {
  //       id: 2,
  //       url: "/tochuc/about",
  //       text: "Lịch sử thành lập và quá trình phát triển",
  //       icon: <BsPersonCheck />,
  //     },
  //   ],
  // },
  // {
  //   id: 3,
  //   active: true,
  //   url: "/nhacviec",
  //   text: "Nhắc việc",
  //   children: [],
  // },
  // {
  //   id: 9,
  //   active: true,
  //   url: "/vanban",
  //   text: "Văn bản",
  //   children: [],
  // },
  {
    id: 3,
    active: true,
    url: "/qlpt",
    text: "Phương tiện",
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
        text: "Biến động tăng - giảm",
        icon: <GrTransaction />,
      },
      {
        id: 3,
        url: "/qlpt/xuatnhap/import",
        text: "Nhập phương tiện",
        icon: <GrTransaction />,
      },
      {
        id: 4,
        url: "/qlpt/xuatnhap/export",
        text: "Xuất/Điều chuyển phương tiện",
        icon: <GrTransaction />,
      },
      {
        id: 5,
        url: "/qlpt/huhong",
        text: "Phương tiện hư hỏng",
        icon: <GrTransaction />,
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
    id: 4,
    active: true,
    url: "/thuquy",
    text: "Thủ quỹ",
    children: []
  },
  {
    id: 5,
    active: false,
    url: "/coso",
    text: "Địa bàn",
    children: [
      {
        id: 1,
        url: "/coso",
        text: "Cơ sở thuộc diện quản lý",
        icon: <FcDepartment />,
      },
      {
        id: 2,
        url: "/coso/tuyentruyen",
        text: "Công tác tuyên truyền",
        icon: <GiPublicSpeaker />,
      },
      {
        id: 3,
        url: "/coso/huanluyen",
        text: "Công tác huấn luyện",
        icon: <GiTeacher />,
      },
      {
        id: 3,
        url: "/coso/thuctap",
        text: "Công tác thực tập phương án",
        icon: <GiSmallFire />,
      },
    ],
  },
  {
    id: 5,
    active: true,
    url: "/tspl",
    text: "Thư viện",
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
        text: "Tài liệu nghiệp vụ",
        icon: <IoLibrarySharp />,
      },
    ],
  },
];

export const social = [
  {
    id: 1,
    url: "https://www.twitter.com",
    icon: <FaFacebook />,
  },
  {
    id: 2,
    url: "https://www.twitter.com",
    icon: <FaTwitter />,
  },
  {
    id: 3,
    url: "https://www.twitter.com",
    icon: <FaLinkedin />,
  },
  {
    id: 4,
    url: "https://www.twitter.com",
    icon: <FaBehance />,
  },
];
