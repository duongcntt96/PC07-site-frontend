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
  {
    id: 2,
    url: "/qlpt",
    text: "Phương tiện",
    children: [
      {
        id: 1,
        url: "/qlpt",
        text: "Thống kê tiềm lực",
        icon: <BsCardChecklist />,
      },
      {
        id: 2,
        url: "/qlpt/nhapkho",
        text: "Nhập/Xuất",
        icon: <GrTransaction />,
      },
      {
        id: 3,
        url: "/qlpt/baocao",
        text: "Báo cáo",
        icon: <GoReport />,
      },
      {
        id: 4,
        url: "/qlpt/docs",
        text: "Văn bản, tài liệu",
        icon: <SiReadthedocs />,
      },
    ],
  },
  {
    id: 3,
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
    id: 4,
    url: "/tochuc",
    text: "Tổ chức",
    children: [
      {
        id: 1,
        url: "/tochuc/to",
        text: "Danh sách các tổ",
        icon: <MdGroup />,
      },
      {
        id: 2,
        url: "/tochuc/person",
        text: "Danh sách cán bộ chiến sỹ",
        icon: <BsPersonCheck />,
      },
    ],
  },
  {
    id: 5,
    url: "/thuvien",
    text: "Thư viện",
    children: [
      {
        id: 1,
        url: "/thuvien/tspl",
        text: "Tủ sách pháp luật",
        icon: <GoLaw />,
      },
      {
        id: 2,
        url: "/thuvien/tlnv",
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
