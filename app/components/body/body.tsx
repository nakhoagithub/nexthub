"use client";
import React, { useContext } from "react";
import Menu from "../menu/menu";
import { usePathname } from "next/navigation";
import { StoreContext } from "../context-provider";

const Body = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const store = useContext(StoreContext);
  const { user } = store.getState();

  function isViewMenu() {
    if (user && pathname.startsWith("/admin")) {
      return true;
    }
    return false;
  }

  return (
    <div className="body">
      {isViewMenu() && (
        <div className="menu">
          <Menu />
        </div>
      )}
      <div className="page">{children}</div>
    </div>
  );
};

export default Body;
