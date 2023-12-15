"use client";
import app from "@/utils/axios";
import { App, ConfigProvider, Spin, notification } from "antd";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "./context-provider";
import { usePathname, useRouter } from "next/navigation";
import NotAccess from "./result/not-access";
import { MenuData } from "@/interfaces/menu-data";
import LoadingPage from "./layout/loading";

notification.config({
  placement: "topRight",
  duration: 2,
});

export default function AppProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const store = useContext(StoreContext);
  const { login, setLanguageData } = store.getState();
  const [menus, setMenu] = useState<MenuData[]>([]);
  const [access, setAccess] = useState<any>(undefined);

  function checkAccessView() {
    let newAccess = true;
    if (pathname.startsWith("/admin")) {
      const menu = menus.find((e) => e.url === pathname);
      newAccess = menu ? true : false;
    }
    setAccess(newAccess);
  }

  async function fetchAccessMenu() {
    try {
      const {
        data: { code, datas },
      } = await app.get(`/api/menu/get`);
      if (code === 200) {
        setMenu(datas);
      }
    } catch (error) {}
  }

  async function fetchAuth() {
    try {
      const {
        data: { code, data },
      } = await app.get(`/api/auth`);

      if (code === 200) {
        login(data);
      }
    } catch (error) {}
  }

  async function fetchLanguage() {
    try {
      const {
        data: { code, datas },
      } = await app.get(`/api/language/get`);

      if (code === 200) {
        setLanguageData({ datas: datas });
      }
    } catch (error) {}
  }

  async function fetchData() {
    setLoading(true);
    await fetchAuth();
    await fetchAccessMenu();
    await fetchLanguage();
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // if (menus.length === 0) return;
    checkAccessView();
  }, [pathname, menus]);

  return (
    <ConfigProvider theme={{ token: { colorBgContainer: "white", borderRadius: 2 } }}>
      {loading || access === undefined ? <LoadingPage /> : <App>{access === true ? children : <NotAccess />}</App>}
    </ConfigProvider>
  );
}
