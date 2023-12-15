"use client";
import DataView from "@/app/components/data-view/data-view";
import { translate } from "@/utils/translate";
import { EditOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, FormInstance, Input, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
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
        label="Model name"
        name="modelName"
        rules={[{ required: true, message: translate({ source: "This field cannot be left blank" }) }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Description" name="description">
        <TextArea />
      </Form.Item>
      <Space>
        <Form.Item name="read" valuePropName="checked" initialValue={true}>
          <Checkbox defaultChecked={true}>Read</Checkbox>
        </Form.Item>
        <Form.Item name="create" valuePropName="checked" initialValue={true}>
          <Checkbox defaultChecked={true}>Create</Checkbox>
        </Form.Item>
        <Form.Item name="update" valuePropName="checked" initialValue={true}>
          <Checkbox defaultChecked={true}>Update</Checkbox>
        </Form.Item>
        <Form.Item name="delete" valuePropName="checked" initialValue={true}>
          <Checkbox defaultChecked={true}>Delete</Checkbox>
        </Form.Item>
      </Space>
      <Form.Item label="Active" name="active" valuePropName="checked" initialValue={true}>
        <Checkbox defaultChecked={true}>Active</Checkbox>
      </Form.Item>
    </Form>
  );
};

const Page = () => {
  const columns: ColumnsType<any> = [
    {
      title: "Name",
      dataIndex: "name",
      width: 200,
    },
    {
      title: "Model name",
      dataIndex: "modelName",
      width: 200,
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 500,
    },

    { title: "", key: "none" },
    {
      title: "Read",
      width: 100,
      align: "center",
      render: (value, record, index) => {
        return <Checkbox checked={record.read} />;
      },
    },
    {
      title: "Create",
      width: 100,
      align: "center",
      render: (value, record, index) => {
        return <Checkbox checked={record.create} />;
      },
    },
    {
      title: "Update",
      width: 100,
      align: "center",
      render: (value, record, index) => {
        return <Checkbox checked={record.update} />;
      },
    },
    {
      title: "Delete",
      width: 100,
      align: "center",
      render: (value, record, index) => {
        return <Checkbox checked={record.delete} />;
      },
    },
    {
      title: "Active",
      width: 100,
      align: "center",
      render: (value, record, index) => {
        return <Checkbox checked={record.active} />;
      },
    },
  ];

  return (
    <DataView
      model="access"
      titleHeader="Access Right"
      columnsTable={columns}
      tableBoder={true}
      formLayout={(form, onFinish, viewType, disableForm) => ViewForm(form, onFinish, viewType, disableForm)}
      updateField="id"
    />
  );
};

export default Page;
