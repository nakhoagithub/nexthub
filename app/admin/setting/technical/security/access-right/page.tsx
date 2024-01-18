"use client";
import PageHeader from "@/app/components/body/page-header";
import { StoreContext } from "@/app/components/context-provider";
import DataView from "@/app/components/data-view/data-view";
import TableView from "@/app/components/data-view/table-view/table-view";
import { StoreApp } from "@/store/store";
import { getItemInArray } from "@/utils/tool";
import { translate } from "@/utils/translate";
import { EditOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, FormInstance, Input, Select, Space } from "antd";
const { Option } = Select;
import TextArea from "antd/es/input/TextArea";
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
      <Form.Item label="ID" name="id">
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
        name="idModel"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <Select
          showSearch
          allowClear
          onClear={() => {
            form.setFieldValue("idModel", "");
          }}
          optionFilterProp="children"
          filterOption={(input: string, option: any) => {
            return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
          }}
        >
          {(dataIds?.["model"] ?? [])?.map((e: any) => (
            <Option key={e.id} label={e.name}>
              <span>{e.name}</span>
            </Option>
          ))}
        </Select>
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
  const store = useContext(StoreContext);
  const [dataIds, setDataIds] = useState<any>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const columns: ColumnsType<any> = [
    {
      title: "Name",
      dataIndex: "name",
      width: 300,
    },
    {
      key: "idModel",
      title: "Model name",
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
    <div>
      <PageHeader title="Access Right" />
      <div className="page-content">
        <TableView
          model={"access"}
          columnsTable={columns}
          formLayout={({ store, form, onFinish, viewType }) => ViewForm(store, form, onFinish, viewType, dataIds)}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          ids={[
            {
              model: {
                fields: ["_id", "name", "id"],
                filter: { install: true },
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
