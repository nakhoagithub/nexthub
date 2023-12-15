"use client";
import DataView from "@/app/components/data-view/data-view";
import { translate } from "@/utils/translate";
import { Checkbox, Form, FormInstance, Input, Select } from "antd";
const { Option } = Select;
import { ColumnsType } from "antd/es/table";
import React from "react";

const ViewForm = (
  form: FormInstance<any>,
  onFinish: (value: any) => void,
  viewType: string,
  disabledForm?: boolean
) => {
  return (
    <Form name="form" form={form} layout="vertical" labelWrap style={{ width: 800 }} onFinish={onFinish}>
      <Form.Item label="ID" name="id" rules={[{ required: true, message: translate({ source: "This field cannot be left blank" }) }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Name" name="name" rules={[{ required: true, message: translate({ source: "This field cannot be left blank" }) }]}>
        <Input />
      </Form.Item>
      <Form.Item
        label="Locale Code"
        name="localeCode"
        rules={[{ required: true, message: translate({ source: "This field cannot be left blank" }) }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Direction"
        name="direction"
        rules={[{ required: true, message: translate({ source: "This field cannot be left blank" }) }]}
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
        rules={[{ required: true, message: translate({ source: "This field cannot be left blank" }) }]}
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
      width: 100,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 200,
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 300,
    },
    {
      title: "Collection Name",
      dataIndex: "collectionName",
      width: 200,
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
    <DataView
      model="model"
      titleHeader="Model"
      columnsTable={columns}
      tableBoder={true}
      formLayout={(form, onFinish, viewType, disableForm) => ViewForm(form, onFinish, viewType, disableForm)}
      hideActionUpdate
      hideActionCreate
    />
  );
};

export default Page;
