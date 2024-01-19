"use client";
import React, { useContext, useEffect, useState } from "react";
import { Menu as AntMenu, App, MenuProps } from "antd";
import app from "@/utils/axios";
import { MenuData } from "@/interfaces/menu-data";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { StoreContext } from "../context-provider";
import { translate } from "@/utils/translate";
import { apiResultCode } from "@/utils/tool";

// type MenuItem = Required<MenuProps>["items"][number];

type MenuItem = {
  label?: string;
  key: String;
  icon?: React.ReactNode;
  children?: MenuItem[];
  type?: "group";
  sequence?: number;
};

function getItem({
  label,
  key,
  icon,
  children,
  type,
  sequence,
}: {
  label: React.ReactNode;
  key?: React.Key | null;
  icon?: React.ReactNode;
  children?: MenuItem[];
  type?: "group";
  sequence?: number;
}): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
    sequence,
  } as MenuItem;
}

const Menu = ({ onClickMenu }: { onClickMenu?: () => void }) => {
  const useApp = App.useApp();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [menusData, setMenusData] = useState<MenuData[]>([]);
  const [menus, setMenus] = useState<any[]>([]);
  const store = useContext(StoreContext);

  const onClick: MenuProps["onClick"] = (e) => {
    let menu = menusData.find((menu) => menu.id == e.key);
    let url = menu?.url ?? "/";
    if (pathname === url) return;
    url += `?menu=${menu?.id}`;
    router.push(`${url}`);
    if (onClickMenu) onClickMenu();
  };

  function getDefaultSelectKey() {
    const selectKeys: string[] = [];
    selectKeys.push(searchParams.get("menu")?.toString() ?? "");
    return selectKeys;
  }

  function dataToMenuItem({ parent, menus }: { parent?: string; menus: MenuData[] }) {
    let menusData: MenuItem[] = [];

    for (var menu of menus) {
      if (menu.idParent === null) {
        delete menu.idParent;
      }

      // children
      if (menu.idParent === parent) {
        let children = dataToMenuItem({ parent: menu.id, menus: menus });
        menusData.push(
          getItem({
            label: translate({ store, source: menu.name }),
            key: menu.id,
            children: children.length == 0 ? undefined : children,
            type: menu.isGroup ? "group" : undefined,
            sequence: menu.sequence,
          })
        );
      }
    }

    menusData.sort((a, b) => {
      if (!a.sequence || !b.sequence) {
        return 1;
      }
      return a.sequence > b.sequence ? 1 : -1;
    });

    return menusData;
  }

  async function getMenus() {
    try {
      const {
        data: { code, datas },
      } = await app.get(`/api/menu/get`);

      if (code === 200) {
        if (Array.isArray(datas)) {
          setMenusData(datas);
          setMenus(dataToMenuItem({ menus: datas }));
        }
      }
    } catch (error) {
      let { message, content } = apiResultCode({ error: error, store });
      useApp.notification.error({ message: message, description: content });
    }
  }

  async function fetchData() {
    setLoading(true);
    await getMenus();
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <AntMenu
      onClick={onClick}
      style={{ width: 200, height: "100%" }}
      selectedKeys={getDefaultSelectKey()}
      mode="vertical"
      items={menus}
    />
  );
};

export default Menu;
