"use client";
import DataView from "@/app/components/data-view/data-view";
import { Button, Checkbox, Form, FormInstance, Input, InputNumber, Select, Tabs } from "antd";
const { Option } = Select;
import { ColumnsType } from "antd/es/table";
import React, { useContext, useState } from "react";
import One2ManyView from "@/app/components/data-view/o2m-view/o2m-view";
import { userStates } from "@/utils/config";
import { translate } from "@/utils/translate";
import { StoreContext } from "@/app/components/context-provider";
import TextArea from "antd/es/input/TextArea";
import { StoreApi } from "zustand";
import { StoreApp } from "@/store/store";
import { getItemInArray } from "@/utils/tool";
import TableView from "@/app/components/data-view/table-view/table-view";
import PageHeader from "@/app/components/body/page-header";

const ViewForm = (
  store: StoreApi<StoreApp>,
  form: FormInstance<any>,
  onFinish: (value: any) => void,
  viewType: string | null,
  dataIds: any
) => {
  return (
    <Form name="form" form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="ID"
        name="id"
        rules={[{ required: true, message: translate({ store, source: "This field cannot be left blank" }) }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: translate({ store, source: "This field cannot be left blank" }) }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Parent" name="idParent">
        <Select
          showSearch
          allowClear
          onClear={() => {
            form.setFieldValue("idParent", "");
          }}
          filterOption={(input: string, option: any) => {
            return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
          }}
        >
          {(dataIds?.["area"] ?? [])?.map((e: any) => (
            <Option key={e._id} label={e.name}>
              <span>{e.name}</span>
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Farm" name="idFarm">
        <Select
          showSearch
          allowClear
          onClear={() => {
            form.setFieldValue("idFarm", "");
          }}
          filterOption={(input: string, option: any) => {
            return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
          }}
        >
          {(dataIds?.["farm"] ?? [])?.map((e: any) => (
            <Option key={e._id} label={e.name}>
              <span>{e.name}</span>
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Description" name="description">
        <TextArea />
      </Form.Item>

      <Form.Item label="Sort Index" name="sortIndex" initialValue={1}>
        <InputNumber min={1} value={1} />
      </Form.Item>

      <Form.Item label="Active" name="active" valuePropName="checked" initialValue={true}>
        <Checkbox defaultChecked={true}>Active</Checkbox>
      </Form.Item>
    </Form>
  );
};

const Page = () => {
  const store = useContext(StoreContext);
  const [dataIds, setDataIds] = useState<any>();

  const columns: ColumnsType<any> = [
    {
      title: "ID",
      dataIndex: "id",
      width: 100,
    },
    {
      title: translate({ store, source: "Farm" }),
      width: 200,
      render: (value, record, index) => {
        return <div>{record.idFarm && getItemInArray(dataIds?.["farm"] ?? [], record.idFarm, "_id")?.name}</div>;
      },
    },
    {
      title: translate({ store, source: "Name" }),
      dataIndex: "name",
      width: 200,
    },
    {
      title: translate({ store, source: "Description" }),
      dataIndex: "description",
      width: 300,
    },
    { title: "", key: "none" },
    {
      title: translate({ store, source: "Sort" }),
      dataIndex: "sortIndex",
      width: 100,
    },
    {
      title: translate({ store, source: "Active" }),
      width: 100,
      align: "center",
      render: (value, record, index) => {
        return <Checkbox checked={record.active} />;
      },
    },
  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  return (
    <div>
      <PageHeader title="Area" />
      <div className="page-content">
        <TableView
          model={"area"}
          columnsTable={columns}
          formLayout={({ store, form, onFinish, viewType }) => ViewForm(store, form, onFinish, viewType, dataIds)}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          updateField="id"
          ids={[
            {
              farm: {
                fields: ["_id", "name"],
                filter: { active: true },
              },
            },
            {
              area: {
                fields: ["_id", "name"],
                filter: { active: true },
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
