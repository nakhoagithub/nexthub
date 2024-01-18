import { Card, List, Space } from "antd";
import React from "react";

const KanbanView = ({
  loading,
  datas,
  renderItemKanban,
}: {
  loading?: boolean;
  datas: any[];
  renderItemKanban?: (value: any, index: number) => React.ReactNode;
}) => {
  return (
    <div className="kanban-view">
      <List
        rowKey="_id"
        loading={loading}
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4,
        }}
        dataSource={[...datas]}
        renderItem={(item, index) => {
          return (
            <List.Item key={item._id}>
              {renderItemKanban ? renderItemKanban(item, index) : <Card key={item._id} title={item?.name ?? ""} />}
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default KanbanView;
