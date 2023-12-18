import { App, Button, Form, FormInstance, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import ModalTableSelection from "./modal-table-selection";
import { FilterValue, SorterResult, TablePaginationConfig, TableRowSelection } from "antd/es/table/interface";
import { getParamFilter } from "@/utils/tool";
import app from "@/utils/axios";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DeleteOutlined } from "@ant-design/icons";

const One2ManyView = ({
  title,
  titleModel,
  idsField,
  model,
  toModel,
  columnsTable,
  showAdd,
  form,
}: {
  title?: string;
  titleModel?: string;
  idsField: string;
  model: string;
  toModel: string;
  columnsTable?: ColumnsType<any> | undefined;
  showAdd?: boolean;
  form?: FormInstance<any>;
}) => {
  const useApp = App.useApp();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const viewType = searchParams.get("viewType");
  const viewId = searchParams.get("viewId");
  const [openModelAdd, setOpenModelAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [datas, setDatas] = useState<any[]>([]);
  const [ids, setIds] = useState<string[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [tableParams, setTableParams] = useState<any>({
    pagination: {
      current: 1,
      pageSize: 10,
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

  let newColumnsTable = [...(columnsTable ?? [])];
  newColumnsTable.push({
    title: "",
    width: 50,
    fixed: "right",
    align: "center",
    render: (value: any, record: any, index: number) => {
      return (
        <Space>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              let newDatas = [...datas];
              newDatas.splice(index, 1);
              setDatas(newDatas);
            }}
          />
        </Space>
      );
    },
  });

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: onSelectChange,
    columnWidth: "40px",
  };

  async function fetchDataIds() {
    if (viewType !== "update") return;
    try {
      let newQuery = getParamFilter(tableParams);
      const {
        data: { code, datas, total },
      } = await app.get(
        `/api/model/${toModel}/get?sort=${JSON.stringify(newQuery.sort)}&limit=${newQuery.limit}&skip=${
          newQuery.skip
        }&filter=${JSON.stringify({ _id: { $in: ids } })}`
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

  async function fetchDataFormUpdate() {
    try {
      if (!viewId) return;

      let newFilter: any = { _id: viewId };
      const {
        data: { datas, code },
      } = await app.get(`/api/model/${model}/get?filter=${JSON.stringify(newFilter)}`);

      if (code === 200) {
        if (datas[0][idsField].length > 0) setIds(datas[0][idsField]);
      }
    } catch (error) {
      useApp.notification.error({ message: "Internal Server Error" });
    }
  }

  async function fetchData() {
    setLoading(true);
    await fetchDataIds();
    setLoading(false);
  }

  useEffect(() => {
    if (ids.length === 0) return;
    fetchData();
  }, [ids]);

  useEffect(() => {
    fetchDataFormUpdate();
  }, [viewId]);

  useEffect(() => {
    fetchData();
  }, [JSON.stringify(tableParams)]);

  useEffect(() => {
    form?.setFieldValue(
      idsField,
      datas.map((e) => e._id)
    );
  }, [datas]);

  return (
    <div>
      <ModalTableSelection
        model={toModel}
        title={titleModel}
        open={openModelAdd}
        datasO2M={datas}
        setOpen={setOpenModelAdd}
        columnsTable={columnsTable}
        onOk={(values: any[]) => {
          let newDatas = [];

          for (var value of values) {
            if (!datas.find((e) => e._id === value._id)) {
              newDatas.push(value);
            }
          }
          setDatas([...datas, ...newDatas]);
        }}
      />
      {title && <div style={{ fontSize: 20, fontWeight: "bold" }}>{title}</div>}
      <div style={{ margin: "12px 0" }}>
        <Space>
          {showAdd && (
            <Button size="small" onClick={() => setOpenModelAdd(true)}>
              Add
            </Button>
          )}
        </Space>
      </div>
      <Form.Item name={idsField}>
        <Table
          scroll={{ y: "100%", x: "hidden" }}
          size="small"
          columns={newColumnsTable}
          pagination={{ ...tableParams.pagination, position: ["topLeft"] }}
          dataSource={datas}
          rowKey={(record) => record._id}
          onChange={(pargination, filters, sorter) => handleTableChange(pargination, filters, sorter)}
        />
      </Form.Item>
    </div>
  );
};

export default One2ManyView;
