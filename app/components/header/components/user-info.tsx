import { LogoutOutlined } from "@ant-design/icons";
import { App, Avatar, Dropdown, MenuProps, Space } from "antd";
import React, { useContext } from "react";
import { StoreContext } from "../../context-provider";
import app from "@/utils/axios";
import { usePathname, useRouter } from "next/navigation";

const UserInfo = () => {
  const router = useRouter();
  const pathname = usePathname();
  const store = useContext(StoreContext);
  const { user, logout } = store.getState();
  let name = user?.name && user?.name !== "" ? user.name : user?.username ?? "U";
  const useApp = App.useApp();

  function removeAllQueryParams() {
    const current = new URLSearchParams();
    const query = current.toString();
    router.push(`${pathname}${query}`);
  }

  async function handleLogout() {
    try {
      const {
        data: { code, message },
      } = await app.post(`/api/logout`);

      if (code === 200) {
        useApp.message.success("Success");
        logout();
        removeAllQueryParams();
        // router.push("/");
        window.location.pathname = "/";
      } else {
        if (message) {
          useApp.message.error(message ?? "");
        }
      }
    } catch (error) {
      useApp.message.error(error?.toString() ?? "");
    }
  }

  const items: MenuProps["items"] = [
    {
      label: "User Information",
      key: "user-information",
    },
    {
      type: "divider",
    },
    {
      label: "Logout",
      key: "logout",
      danger: true,
      icon: <LogoutOutlined />,
      onClick: async () => {
        await handleLogout();
      },
    },
  ];

  return (
    <div>
      {user ? (
        <Space>
          <Avatar style={{ backgroundColor: "#87d068" }} alt="Image user">
            {(user.name ?? user.username ?? "U").substring(0, 1).toUpperCase()}
          </Avatar>
          <Dropdown menu={{ items }} trigger={["click"]}>
            <a onClick={(e) => e.preventDefault()} className="text-ellipsis">
              {name}
            </a>
          </Dropdown>
        </Space>
      ) : (
        <div>{!pathname.startsWith("/login") && <a href="/login">Login</a>}</div>
      )}
    </div>
  );
};

export default UserInfo;
