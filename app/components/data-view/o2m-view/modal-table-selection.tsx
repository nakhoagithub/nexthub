import app from "@/utils/axios";
import { getParamFilter } from "@/utils/tool";
import { App, Modal, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import { FilterValue, SorterResult, TablePaginationConfig, TableRowSelection } from "antd/es/table/interface";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ModalTableSelection = ({
  model,
  title,
  open,
  setOpen,
  columnsTable,
  datasO2M,
  onOk,
}: {
  model: string;
  title?: string;
  open: boolean;
  setOpen: (value: boolean) => void;
  datasO2M: any[];
  columnsTable?: ColumnsType<any>;
  onOk?: (values: any[]) => void;
}) => {
  const useApp = App.useApp();
  const [loading, setLoading] = useState(false);
  const [datas, setDatas] = useState<any[]>([]);
  const [datasSelected, setDatasSelected] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [tableParams, setTableParams] = useState<any>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys([...newSelectedRowKeys]);
    // setDatasSelected([...datasSelected, ...datas.filter((e) => newSelectedRowKeys.includes(e._id) && !datasSelected.includes(e._id))]);
  };

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: onSelectChange,
    columnWidth: "40px",
  };

  async function fetchDataModel() {
    try {
      let newQuery = getParamFilter(tableParams);

      const {
        data: { code, datas, total },
      } = await app.get(
        `/api/model/${model}/get?sort=${JSON.stringify(newQuery.sort)}&limit=${newQuery.limit}&skip=${newQuery.skip}`
      );

      if (code === 200) {
        setDatas(datas);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: total,
          },
        });
      }
    } catch (error) {
      useApp.notification.error({ message: "Internal Server Error" });
    }
  }

  async function fetchData() {
    setLoading(true);
    await fetchDataModel();
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
    setSelectedRowKeys(datasO2M.map((e) => e._id));
  }, [JSON.stringify(tableParams)]);

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

  return (
    <Modal
      width={800}
      title={title}
      open={open}
      onCancel={() => setOpen(false)}
      closable={false}
      afterOpenChange={() => {
        setSelectedRowKeys(datasO2M.map((e) => e._id));
      }}
      afterClose={() => {
        setSelectedRowKeys([]);
      }}
      onOk={() => {
        if (onOk) onOk(datas.filter((e) => selectedRowKeys.includes(e._id)));
        setOpen(false);
      }}
    >
      <Table
        size="small"
        rowSelection={rowSelection}
        columns={columnsTable}
        dataSource={datas}
        loading={loading}
        rowKey={(record) => record._id}
        pagination={{ ...tableParams.pagination, position: ["topLeft"] }}
        onChange={(pargination, filters, sorter) => handleTableChange(pargination, filters, sorter)}
      />
    </Modal>
  );
};

export default ModalTableSelection;
