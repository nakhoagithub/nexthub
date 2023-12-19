import { pageSizeOptions } from "@/interfaces/page-size-options";
import { PlusOutlined, ReloadOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Space, Table, TablePaginationConfig } from "antd";
import { FilterValue, SorterResult, TableRowSelection } from "antd/es/table/interface";
import React, { useEffect, useState } from "react";

const TableView = ({
  model,
  bordered,
  columnsTable,
  selectedRowKeys,
  setSelectedRowKeys,
}: {
  model: string;
  bordered?: boolean;
  columnsTable?: any[];
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: (value: React.Key[]) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [loadingReload, setLoadingButtonReload] = useState(false);
  const [datas, setDatas] = useState<any[]>([]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: onSelectChange,
    columnWidth: "40px",
  };

  async function fetchData() {
    setLoading(true);

    setLoading(false);
  }

  async function onReload() {
    setLoadingButtonReload(true);
    await fetchData();
    setLoadingButtonReload(false);
  }

  async function onCreate() {}

  const [tableParams, setTableParams] = useState<any>({
    pagination: {
      current: 1,
      pageSize: 20,
      pageSizeOptions: pageSizeOptions,
    },
  });

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[]
  ) => {
    setTableParams({
      pagination,
      filters,
      sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setDatas([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams)]);

  return (
    <div className="table-view">
      <div className="table-view-header">
        <div className="table-view-header-left">
          <Space wrap>
            <Button icon={<ReloadOutlined />} loading={loadingReload} onClick={onReload} />
            <Button icon={<PlusOutlined />} loading={loadingReload} onClick={onCreate}>
              Create
            </Button>
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
