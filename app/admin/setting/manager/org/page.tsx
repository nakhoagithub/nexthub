"use client";
import DataView from "@/app/components/data-view/data-view";
import { getItemInArray } from "@/utils/tool";
import { translate } from "@/utils/translate";
import { Button, Checkbox, Form, FormInstance, Input, InputNumber, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { ColumnsType } from "antd/es/table";
import React, { useState } from "react";
const { Option } = Select;

const ViewForm = (form: FormInstance<any>, onFinish: (value: any) => void, viewType: string, dataIds: any) => {
  return (
    <Form name="form" form={form} layout="vertical" style={{ width: 600 }} onFinish={onFinish}>
      <Form.Item label="Name" name="name" rules={[{ required: true, message: translate({ source: "This field cannot be left blank" }) }]}>
        <Input />
      </Form.Item>
      <Form.Item label="Short name" name="shortName">
        <Input />
      </Form.Item>
      <Form.Item label="Parent" name="idParent">
        <Select
          allowClear
          onClear={() => {
            form.setFieldValue("idParent", "");
          }}
        >
          {dataIds["org"]?.map((e: any) => (
            <Option key={e._id} label={e.name}>
              <span>{e.name}</span>
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Address" name="address">
        <TextArea />
      </Form.Item>
      <Form.Item label="Email" name="email">
        <Input />
      </Form.Item>
      <Form.Item label="VAT" name="vat">
        <Input />
      </Form.Item>
      <Form.Item label="Description" name="description">
        <TextArea />
      </Form.Item>
      <Form.Item label="Sequence" name="sequence">
        <InputNumber />
      </Form.Item>
      <Form.Item label="Active" name="active" valuePropName="checked" initialValue={true}>
        <Checkbox defaultChecked={true}>Active</Checkbox>
      </Form.Item>
    </Form>
  );
};

const Page = () => {
  const [dataIds, setDataIds] = useState<any>();

  const columns: ColumnsType<any> = [
    {
      title: "Name",
      dataIndex: "name",
      width: 200,
      sorter: {
        compare: (a, b) => ((a.name as string | undefined) ?? "").localeCompare((b.name as string | undefined) ?? ""),
        multiple: 1,
      },
    },
    {
      title: "Short name",
      dataIndex: "shortName",
      width: 100,
    },
    {
      title: "Parent",
      width: 200,
      render: (value, record, index) => {
        return <div>{record.idParent && getItemInArray(dataIds?.["org"] ?? [], record.idParent, "_id")?.name}</div>;
      },
    },
    {
      title: "Address",
      dataIndex: "address",
      width: 300,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 200,
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 300,
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
    {
      title: "Seq",
      dataIndex: "sequence",
      width: 60,
      align: "center",
      defaultSortOrder: "ascend",
      sorter: {
        compare: (a, b) => (a.sequence > b.sequence ? 1 : -1),
        multiple: 2,
      },
    },
  ];

  return (
    <div>
      <DataView
        model="org"
        titleHeader="Organization"
        columnsTable={columns}
        tableBoder={true}
        formLayout={(form, onFinish, viewType) => ViewForm(form, onFinish, viewType, dataIds)}
        ids={[
          { org: { fields: ["_id", "name"], filter: { active: true } } },
          { user: { fields: ["_id", "name"], filter: { active: true } } },
        ]}
        dataIdsCallback={(value: any) => setDataIds(value)}
      />
    </div>
  );
};

export default Page;
