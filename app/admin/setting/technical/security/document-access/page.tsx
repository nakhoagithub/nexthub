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
        <Form.Item name="apply_for_read" valuePropName="checked" initialValue={true}>
          <Checkbox defaultChecked={true} checked={true}>
            Read
          </Checkbox>
        </Form.Item>
        <Form.Item name="apply_for_create" valuePropName="checked" initialValue={true}>
          <Checkbox defaultChecked={true} checked={true}>
            Create
          </Checkbox>
        </Form.Item>
        <Form.Item name="apply_for_update" valuePropName="checked" initialValue={true}>
          <Checkbox defaultChecked={true} checked={true}>
            Update
          </Checkbox>
        </Form.Item>
        <Form.Item name="apply_for_delete" valuePropName="checked" initialValue={true}>
          <Checkbox defaultChecked={true} checked={true}>
            Delete
          </Checkbox>
        </Form.Item>
      </Space>
      <Form.Item label="Active" name="active" valuePropName="checked" initialValue={true}>
        <Checkbox defaultChecked={true} checked={true}>
          Active
        </Checkbox>
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
      title: "ID",
      dataIndex: "id",
      width: 200,
    },
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
    <div>
      <PageHeader title="Document Access" />
      <div className="page-content">
        <TableView
          model={"document-access"}
          columnsTable={columns}
          formLayout={({ store, form, onFinish, viewType }) => ViewForm(store, form, onFinish, viewType, dataIds)}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          ids={[
            {
              model: {
                fields: ["_id", "id", "name"],
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
