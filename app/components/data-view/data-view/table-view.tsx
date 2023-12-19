import { AccessRightModel } from "@/interfaces/access-right-model";
import { pageSizeOptions } from "@/interfaces/page-size-options";
import app from "@/utils/axios";
import { DeleteOutlined, PlusOutlined, ReloadOutlined, SettingOutlined } from "@ant-design/icons";
import { App, Button, Space, Table, TablePaginationConfig } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { FilterValue, SorterResult, TableRowSelection } from "antd/es/table/interface";
import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context-provider";

const TableView = ({
  model,
  bordered,
  width,
  scrollY,
  scrollX,
  size,
  columnsTable,
  columnsView,
  selectedRowKeys,
  setSelectedRowKeys,
}: {
  model: string;
  bordered?: boolean;
  width?: number;
  scrollY?: string | number | undefined;
  scrollX?: string | number | undefined;
  size?: SizeType;
  columnsTable?: any[];
  columnsView?: string[];
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: (value: React.Key[]) => void;
}) => {
  const useApp = App.useApp();
  const [loading, setLoading] = useState(false);
  const [accessRightModel, setAccessRightModel] = useState<AccessRightModel>();
  const [loadingReload, setLoadingButtonReload] = useState(false);
  const [datas, setDatas] = useState<any[]>([]);
  const store = useContext(StoreContext);
  const { setLanguageData } = store.getState();

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: onSelectChange,
    columnWidth: "40px",
  };

  async function getAccess() {
    try {
      const {
        data: { access, code },
      } = await app.get(`/api/model/${model}/access`);

      if (code === 200) {
        setAccessRightModel(access);
      }
    } catch (error) {
      useApp.notification.error({ message: "Internal Server Error" });
    }
  }

  async function getColumns() {
    try {
      let filter = { modelName: model, field: { $in: columnsView ?? [] } };
      const {
        data: { code, datas },
      } = await app.get(`/api/model/schema/get?filter=${JSON.stringify(filter)}`);

      if (code === 200) {
        console.log(datas);
      }
    } catch (error) {}
  }

  async function fetchLanguageModel() {
    try {
      const {
        data: { code, datas },
      } = await app.get(`/api/language/get?modelName=${model}`);

      if (code === 200) {
        setLanguageData({ datas: datas });
      }
    } catch (error) {
      useApp.notification.error({ message: "Internal Server Error" });
    }
  }

  async function fetchData() {
    setLoading(true);
    await getAccess();
    await getColumns();
    await fetchLanguageModel();
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
  }, []);

  useEffect(() => {}, [JSON.stringify(tableParams)]);

  return (
    <div className="table-view">
      <div className="table-view-header">
        <div className="table-view-header-left">
          <Space wrap>
            <Button icon={<ReloadOutlined />} loading={loadingReload} onClick={onReload} />
            {accessRightModel?.create && (
              <Button icon={<PlusOutlined />} onClick={onCreate}>
                Create
              </Button>
            )}

            {accessRightModel?.update && <Button onClick={onCreate}>Update</Button>}

            {accessRightModel?.delete && (
              <Button icon={<DeleteOutlined />} onClick={onCreate} danger>
                Delete
              </Button>
            )}
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
          style={{ width: width }}
          scroll={{ y: scrollY ?? "100%", x: scrollX ?? "hidden" }}
          size={size ?? "small"}
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
