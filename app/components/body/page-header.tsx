import React from "react";

const PageHeader = ({ title, subtitle, action }: { title?: string; subtitle?: string; action?: React.ReactNode }) => {
  return (
    <div className="page-header">
      <div className="page-header-title">{title}</div>
      {subtitle && <div className="page-header-sub-title">{subtitle}</div>}
      {action !== undefined && <div className="page-header-action">{action}</div>}
    </div>
  );
};

export default PageHeader;
