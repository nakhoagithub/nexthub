"use client";
import PageHeader from "@/app/components/body/page-header";
import { StoreContext } from "@/app/components/context-provider";
import DataView from "@/app/components/data-view/data-view";
import TableView from "@/app/components/data-view/table-view/table-view";
import { StoreApp } from "@/store/store";
import { getItemInArray } from "@/utils/tool";
import { translate } from "@/utils/translate";
import { Checkbox, Form, FormInstance, Input, Select } from "antd";
const { Option } = Select;
import { ColumnsType } from "antd/es/table";
import React, { useContext, useState } from "react";
import { StoreApi } from "zustand";

const ViewForm = (
  store: StoreApi<StoreApp>,
  form: FormInstance<any>,
  onFinish: (value: any) => void,
  viewType: string | null,
  dataIds: any
) => {
  return (
    <Form name="form" form={form} layout="vertical" labelWrap onFinish={onFinish}>
      {/* <Form.Item
        label="ID"
        name="id"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Locale Code"
        name="localeCode"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Direction"
        name="direction"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <Select>
          <Option key="ltr" label="Left-To-Right">
            <span>Left-To-Right</span>
          </Option>
          <Option key="rtl" label="Right-To-Left">
            <span>Right-To-Left</span>
          </Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="ISO Code"
        name="isoCode"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label={translate({ store, source: "Active" })} name="active" valuePropName="checked" initialValue={true}>
        <Checkbox defaultChecked={true}>Active</Checkbox>
      </Form.Item> */}
    </Form>
  );
};

const Page = () => {
  const store = useContext(StoreContext);
  const [dataIds, setDataIds] = useState<any>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const columns: ColumnsType<any> = [
    {
      title: "ID",
      dataIndex: "id",
      width: 200,
    },
    {
      key: "idModel",
      title: "Model Name",
      dataIndex: "idModel",
      width: 200,
      render: (value, record, index) => {
        return <div>{record.idModel && getItemInArray(dataIds?.["model"] ?? [], record.idModel, "id")?.name}</div>;
      },
      filters: [
        ...(dataIds?.["model"] ?? []).map((e: any) => {
          return {
            text: e.name,
            value: e.id,
          };
        }),
      ],
    },
    {
      title: "Comment",
      dataIndex: "comment",
      width: 300,
    },
    {
      title: "Field",
      dataIndex: "field",
      width: 200,
    },
    {
      title: "Type",
      dataIndex: "type",
      width: 120,
    },
    {
      title: "Required",
      width: 100,
      align: "center",
      render: (value: any, record: any, index: number) => {
        return <Checkbox checked={record.required} />;
      },
    },
    {
      title: "Unique",
      width: 100,
      align: "center",
      render: (value: any, record: any, index: number) => {
        return <Checkbox checked={record.unique} />;
      },
    },
    {
      title: "Readonly",
      width: 100,
      align: "center",
      render: (value: any, record: any, index: number) => {
        return <Checkbox checked={record.readonly} />;
      },
    },
    {
      title: "Select",
      width: 100,
      align: "center",
      render: (value: any, record: any, index: number) => {
        return <Checkbox checked={record.select} />;
      },
    },
    {
      title: "Ref",
      dataIndex: "ref",
      width: 120,
      align: "center",
    },
    {
      title: "Default",
      dataIndex: "default",
      width: 120,
    },
    { title: "", key: "none" },
  ];

  return (
    <div>
      <PageHeader title="Schema" />
      <div className="page-content">
        <TableView
          model={"schema"}
          columnsTable={columns}
          pageSize={50}
          formLayout={({ store, form, onFinish, viewType }) => ViewForm(store, form, onFinish, viewType, dataIds)}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          hideActionUpdate
          hideActionCreate
          ids={[
            {
              model: {
                fields: ["_id", "id", "name"],
              },
            },
          ]}
          dataIdsCallback={(value) => setDataIds(value)}
        />
      </div>
    </div>
  );
};

export default Page;
