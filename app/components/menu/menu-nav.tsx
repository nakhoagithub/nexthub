"use client";
import { Menu, MenuProps } from "antd";
import React, { useState } from "react";

const items: MenuProps["items"] = [
  {
    label: "One",
    key: "mail",
    icon: null,
  },
  {
    label: "Two",
    key: "app",
    icon: null,
  },
  {
    label: "Three - Submenu",
    key: "SubMenu",
    icon: null,
    children: [
      {
        type: "group",
        label: "Item 1",
        children: [
          {
            label: "Option 1",
            key: "setting:1",
          },
          {
            label: "Option 2",
            key: "setting:2",
          },
        ],
      },
      {
        type: "group",
        label: "Item 2",
        children: [
          {
            label: "Option 3",
            key: "setting:3",
          },
          {
            label: "Option 4",
            key: "setting:4",
          },
        ],
      },
    ],
  },
  {
    label: "Tesst",
    key: "alipay",
  },
];

const MenuNav = () => {
  const [current, setCurrent] = useState("mail");

  const onClick: MenuProps["onClick"] = (e) => {
    setCurrent(e.key);
  };

  return <Menu style={{ width: "100%" }} onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
};

export default MenuNav;
