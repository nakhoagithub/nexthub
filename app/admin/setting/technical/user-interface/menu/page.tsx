"use client";
import DataView from "@/app/components/data-view/data-view";
import { translate } from "@/utils/translate";
import { Checkbox, Form, FormInstance, Input } from "antd";
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
    <Form name="form" form={form} layout="vertical" style={{ width: 600 }} onFinish={onFinish}>
      <Form.Item label="ID" name="id" rules={[{ required: true, message: translate({ source: "This field cannot be left blank" }) }]}>
        <Input />
      </Form.Item>
      <Form.Item label="ID Parent" name="idParent">
        <Input />
      </Form.Item>
      <Form.Item label="Name" name="name" rules={[{ required: true, message: translate({ source: "This field cannot be left blank" }) }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Url" name="url">
        <Input />
      </Form.Item>
      <Form.Item label="Description" name="description">
        <TextArea />
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
      width: 300,
    },
    {
      title: "ID Parent",
      dataIndex: "idParent",
      width: 300,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 200,
    },
    {
      title: "Is Group",
      width: 100,
      align: "center",
      render: (value, record, index) => {
        return <Checkbox checked={record.isGroup} />;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 500,
    },
    {
      title: "Url",
      dataIndex: "url",
      width: 200,
    },
    { title: "", key: "none" },
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
      model="menu"
      titleHeader="Menu"
      columnsTable={columns}
      tableBoder={true}
      formLayout={(form, onFinish, viewType, disableForm) => ViewForm(form, onFinish, viewType, disableForm)}
      updateField="id"
    />
  );
};

export default Page;
