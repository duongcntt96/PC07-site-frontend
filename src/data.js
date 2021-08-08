import React from 'react'
import { FaBehance, FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa'
export const links = [
  {
    id: 1,
    url: '/home',
    text: 'Trang chủ',
  },
  {
    id: 2,
    url: '/phuongtien',
    text: 'Phương tiện',
    children: [
      {
        id: 1,
        url: '/home/sub1',
        text: 'Thống kê phương tiện toàn đội'
      },
      {
        id: 2,
        url: '/home/sub3',
        text: 'Phương tiện theo tổ'
      },
      {
        id: 3,
        url: '/home/sub3',
        text: 'Phương tiện theo chủng loại'
      },
    ]
  },
  {
    id: 3,
    url: '/coso',
    text: 'Cơ sở',
    children: [
      {
        id: 1,
        url: '/home/sub1',
        text: 'Danh sách cơ sở theo địa bàn'
      },
      {
        id: 2,
        url: '/home/sub3',
        text: 'Danh sách cơ sở theo loại hình cơ sở'
      },
      {
        id: 3,
        url: '/home/sub3',
        text: 'Danh sách cơ sở theo phụ lục'
      },
    ]
  },
  {
    id: 4,
    url: '/person',
    text: 'Tổ chức',
    children: [
      {
        id: 1,
        url: '/1',
        text: 'Danh sách các tổ',
      },
      {
        id: 2,
        url: '/2',
        text: 'Danh sách cán bộ chiến sỹ',
      }]
  },
  {
    id: 5,
    url: '/thuvien',
    text: 'Thư viện',
    children: [
      {
        id: 1,
        url: '/1',
        text: 'Văn bản quy phạm pháp luật',
      },
      {
        id: 2,
        url: '/2',
        text: 'Tài liệu nghiệp vụ',
      }]
  },
]

export const social = [
  {
    id: 1,
    url: 'https://www.twitter.com',
    icon: <FaFacebook />,
  },
  {
    id: 2,
    url: 'https://www.twitter.com',
    icon: <FaTwitter />,
  },
  {
    id: 3,
    url: 'https://www.twitter.com',
    icon: <FaLinkedin />,
  },
  {
    id: 4,
    url: 'https://www.twitter.com',
    icon: <FaBehance />,
  },
]
