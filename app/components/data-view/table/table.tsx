"use client";
import { ReloadOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import { FilterValue, SorterResult, TablePaginationConfig, TableRowSelection } from "antd/es/table/interface";
import React, { useState } from "react";

const TableView = ({
  model,
  bordered,
  columnsTable,
  selectedRowKeys,
  setSelectedRowKeys,
  datas,
  fetchData,
  tableParams,
  handleTableChange,
}: {
  model: string;
  bordered?: boolean;
  columnsTable?: any[];
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: (value: React.Key[]) => void;
  datas?: any[];
  fetchData: () => Promise<void>;
  tableParams: any;
  handleTableChange: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[]
  ) => void;
}) => {
  const [loadingReload, setLoadingButtonReload] = useState(false);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: onSelectChange,
    columnWidth: "40px",
  };

  async function onFetch() {
    setLoadingButtonReload(true);
    await fetchData();
    setLoadingButtonReload(false);
  }

  return (
    <div className="table-view">
      <div className="table-view-header">
        <div className="table-view-header-left">
          <Space wrap>
            <Button icon={<ReloadOutlined />} loading={loadingReload} onClick={onFetch} />
          </Space>
        </div>
        <div className="table-view-header-right">
          <Space>
            <Button icon={<SettingOutlined />} />
          </Space>
        </div>
      </div>
      {columnsTable && (
        <Table
          sticky
          scroll={{ y: "100%", x: "hidden" }}
          size="small"
          rowSelection={rowSelection}
          bordered={bordered}
          rowKey={(record) => record?._id}
          columns={columnsTable}
          dataSource={datas}
          loading={loadingReload}
          pagination={{ ...tableParams.pagination, position: ["topRight"] }}
          onChange={(pargination, filters, sorter) => handleTableChange(pargination, filters, sorter)}
        />
      )}
    </div>
  );
};

export default TableView;
