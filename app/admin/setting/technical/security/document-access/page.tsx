"use client";
import { StoreContext } from "@/app/components/context-provider";
import DataView from "@/app/components/data-view/data-view";
import { translate } from "@/utils/translate";
import { EditOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, FormInstance, Input, Space } from "antd";
import TextArea from "antd/es/input/TextArea";
import { ColumnsType } from "antd/es/table";
import React, { useContext } from "react";

const ViewForm = (
  form: FormInstance<any>,
  onFinish: (value: any) => void,
  viewType: string,
  disabledForm?: boolean
) => {
  const store = useContext(StoreContext);
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
        label="Model name"
        name="modelName"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Filter"
        name="filter"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <TextArea />
      </Form.Item>
      <Form.Item label="Description" name="description">
        <TextArea />
      </Form.Item>
      <Space>
        <Form.Item name="apply_for_read" valuePropName="checked">
          <Checkbox defaultChecked={true}>Read</Checkbox>
        </Form.Item>
        <Form.Item name="apply_for_create" valuePropName="checked">
          <Checkbox defaultChecked={true}>Create</Checkbox>
        </Form.Item>
        <Form.Item name="apply_for_update" valuePropName="checked">
          <Checkbox defaultChecked={true}>Update</Checkbox>
        </Form.Item>
        <Form.Item name="apply_for_delete" valuePropName="checked">
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
      title: "ID",
      dataIndex: "id",
      width: 160,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 160,
    },
    {
      title: "Model name",
      dataIndex: "modelName",
      width: 160,
    },
    {
      title: "Filter",
      width: 300,
      render: (value, record, index) => {
        // return <div>{JSON.stringify(record.filter ?? {})}</div>;
        return <div>{record.filter}</div>;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 300,
    },
    { title: "", key: "none" },
    {
      title: "Apply for Read",
      width: 100,
      align: "center",
      render: (value, record, index) => {
        return <Checkbox checked={record.apply_for_read} />;
      },
    },
    {
      title: "Apply for Create",
      width: 100,
      align: "center",
      render: (value, record, index) => {
        return <Checkbox checked={record.apply_for_create} />;
      },
    },
    {
      title: "Apply for Update",
      width: 100,
      align: "center",
      render: (value, record, index) => {
        return <Checkbox checked={record.apply_for_update} />;
      },
    },
    {
      title: "Apply for Delete",
      width: 100,
      align: "center",
      render: (value, record, index) => {
        return <Checkbox checked={record.apply_for_delete} />;
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
      model="document-access"
      titleHeader="Document Access"
      columnsTable={columns}
      tableBoder={true}
      formLayout={(form, onFinish, viewType, disableForm) => ViewForm(form, onFinish, viewType, disableForm)}
      updateField="id"
    />
  );
};

export default Page;
