import { Drawer } from "antd";
import { DrawerStyles } from "antd/es/drawer/DrawerPanel";
import React from "react";
import Menu from "./menu";

const styleDrawer: DrawerStyles = {
  body: {
    padding: 0,
    overflow: "hidden",
  },
};

const DrawerMenuSidebar = ({ open, setOpen }: { open: boolean; setOpen: (value: boolean) => void }) => {
  return (
    <Drawer width={200} styles={styleDrawer} placement="left" open={open} onClose={() => setOpen(false)}>
      <Menu
        onClickMenu={() => {
          setOpen(false);
        }}
      />
    </Drawer>
  );
};

export default DrawerMenuSidebar;
