"use client";
import PageHeader from "@/app/components/body/page-header";
import { StoreContext } from "@/app/components/context-provider";
import DataView from "@/app/components/data-view/data-view";
import TableView from "@/app/components/data-view/table-view/table-view";
import { StoreApp } from "@/store/store";
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
      width: 300,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 300,
    },
    {
      title: "Collection Name",
      dataIndex: "collectionName",
      width: 300,
    },
    {
      title: "Model Name",
      dataIndex: "modelName",
      width: 300,
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 300,
    },
    { title: "", key: "none" },
    {
      title: "Timestamp",
      width: 100,
      align: "center",
      render: (value: any, record: any, index: number) => {
        return <Checkbox checked={record.timestamp} />;
      },
    },
    {
      title: "Version Key",
      width: 100,
      align: "center",
      render: (value: any, record: any, index: number) => {
        return <Checkbox checked={record.versionKey} />;
      },
    },
    {
      title: "Install",
      width: 100,
      align: "center",
      render: (value: any, record: any, index: number) => {
        return <Checkbox checked={record.install} />;
      },
    },
  ];

  return (
    <div>
      <PageHeader title="Model" />
      <div className="page-content">
        <TableView
          model={"model"}
          columnsTable={columns}
          formLayout={({ store, form, onFinish, viewType }) => ViewForm(store, form, onFinish, viewType, dataIds)}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          hideActionUpdate
          hideActionCreate
        />
      </div>
    </div>
  );
};

export default Page;
