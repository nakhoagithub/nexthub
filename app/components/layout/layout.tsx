"use client";
import React from "react";

const Layout = ({ header, body }: { header: React.ReactNode; body: React.ReactNode }) => {
  return (
    <div className="layout">
      {header}
      {body}
    </div>
  );
};

export default Layout;
