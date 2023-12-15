import { Card, Space } from "antd";
import React from "react";

const KanbanView = ({ datas }: { datas: any[] }) => {
  return (
    <Space wrap>
      {...datas.map((e) => {
        console.log(e);
        return <Card key={e._id} title={e?.name ?? ""} />;
      })}
    </Space>
  );
};

export default KanbanView;
