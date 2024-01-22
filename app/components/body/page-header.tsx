import React, { useContext } from "react";
import { StoreContext } from "../context-provider";
import { translate } from "@/utils/translate";

const PageHeader = ({ title, subtitle, action }: { title?: string; subtitle?: string; action?: React.ReactNode }) => {
  const store = useContext(StoreContext);
  return (
    <div className="page-header">
      <div className="page-header-title">{translate({ store, source: title ?? "" })}</div>
      {subtitle && <div className="page-header-sub-title">{translate({ store, source: subtitle ?? "" })}</div>}
      {action !== undefined && <div className="page-header-action">{action}</div>}
    </div>
  );
};

export default PageHeader;
