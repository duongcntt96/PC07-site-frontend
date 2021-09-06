import { GoSignIn } from "react-icons/go";
import { GrContactInfo } from "react-icons/gr";
import { RiTodoLine } from "react-icons/ri";

export const profiles = [
  {
    id: 1,
    url: "/user/profile",
    text: "Thông tin cá nhân",
    icon: <GrContactInfo />,
  },
  {
    id: 2,
    url: "/user/notes",
    text: "Quản lý công việc",
    icon: <RiTodoLine />,
  },
  {
    id: 2,
    url: "/user/login",
    text: "Đăng xuất",
    icon: <GoSignIn />,
  },
];
