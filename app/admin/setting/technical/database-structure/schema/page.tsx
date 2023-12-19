"use client";
import { StoreContext } from "@/app/components/context-provider";
import DataView from "@/app/components/data-view/data-view";
import { StoreApp } from "@/store/store";
import { translate } from "@/utils/translate";
import { Checkbox, Form, FormInstance, Input, Select } from "antd";
const { Option } = Select;
import { ColumnsType } from "antd/es/table";
import React, { useContext } from "react";
import { StoreApi } from "zustand";

const ViewForm = (
  store: StoreApi<StoreApp>,
  form: FormInstance<any>,
  onFinish: (value: any) => void,
  viewType: string,
  disabledForm?: boolean
) => {
  return (
    <Form name="form" form={form} layout="vertical" labelWrap style={{ width: 800 }} onFinish={onFinish}>
      <Form.Item
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
      <Form.Item label="Active" name="active" valuePropName="checked" initialValue={true}>
        <Checkbox defaultChecked={true}>Active</Checkbox>
      </Form.Item>
    </Form>
  );
};

const Page = () => {
  const columns: ColumnsType<any> = [
    {
      title: "ID",
      dataIndex: "id",
      width: 200,
    },
    {
      title: "Model Name",
      dataIndex: "modelName",
      width: 200,
    },
    {
      title: "Comment",
      dataIndex: "comment",
      width: 300,
    },
    {
      title: "Field",
      dataIndex: "field",
      width: 100,
    },
    {
      title: "Type",
      dataIndex: "type",
      width: 100,
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
      title: "Default",
      dataIndex: "default",
      width: 120,
    },
    {
      title: "Ref",
      dataIndex: "ref",
      width: 120,
    },
    { title: "", key: "none" },
  ];

  return (
    <DataView
      model="schema"
      columnsTable={columns}
      tableBoder={true}
      formLayout={({ store,form, onFinish, viewType, disabled}) => ViewForm(store, form, onFinish, viewType, disabled)}
      hideActionUpdate
      hideActionCreate
      titleHeader="Schema"
    />
  );
};

export default Page;
