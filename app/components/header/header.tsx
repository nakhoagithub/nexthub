"use client";
import { MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Grid, Space } from "antd";
import React, { useContext, useState } from "react";
import DrawerMenuSidebar from "../menu/drawer-menu";
import { usePathname, useRouter } from "next/navigation";
import { StoreContext } from "../context-provider";
import SelecteOrg from "./components/select-org";
import UserInfo from "./components/user-info";
const { useBreakpoint } = Grid;

const Header = () => {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);
  const pathname = usePathname();
  const store = useContext(StoreContext);
  const { user } = store.getState();

  const screens = useBreakpoint();

  function isViewMenu() {
    if (user && pathname === "/") return true;
    if (user && screens.sm === false) {
      return true;
    }
    return false;
  }

  return (
    <div className="header">
      <DrawerMenuSidebar open={openMenu} setOpen={setOpenMenu} />

      <div className="header-left">
        <div>
          {isViewMenu() && <Button icon={<MenuUnfoldOutlined />} type="link" onClick={() => setOpenMenu(true)} />}
        </div>
        <div
          className="header-logo"
          onClick={() => {
            router.push("/");
          }}
        >
          <div></div>
        </div>
        <div className="header-logo-title">
          <h1>Title</h1>
        </div>
        {/* <div className="header-menu-nav">
        <MenuNav />
      </div> */}
      </div>
      <div className="header-right">
        <div></div>
        <Space>
          <SelecteOrg />
          <UserInfo />
        </Space>
      </div>
    </div>
  );
};

export default Header;
