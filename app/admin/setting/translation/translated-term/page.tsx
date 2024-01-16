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
      {/* <Form.Item label="ID" name="id">
        <Input />
      </Form.Item> */}
      <Form.Item
        label="Source Term"
        name="sourceTerm"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Translate Value"
        name="translationValue"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Locale Code"
        name="localeCode"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <Select
          allowClear
          onClear={() => {
            form.setFieldValue("localeCode", "");
          }}
        >
          {(dataIds?.["language"] ?? []).map((e: any) => (
            <Option key={e.localeCode} label={e.name}>
              <span>{e.name}</span>
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Model Name" name="modelName">
        <Input />
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
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const columns: ColumnsType<any> = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   width: 200,
    // },
    {
      title: "Source term",
      dataIndex: "sourceTerm",
      width: 500,
    },
    {
      title: "Translate Value",
      dataIndex: "translationValue",
      width: 500,
    },
    {
      title: "Locale Code",
      dataIndex: "localeCode",
      width: 100,
    },
    {
      title: "Model Name",
      dataIndex: "modelName",
      width: 200,
    },
    { title: "", key: "none" },
    {
      title: "Active",
      width: 100,
      align: "center",
      render: (value: any, record: any, index: number) => {
        return <Checkbox checked={record.active} />;
      },
    },
  ];

  return (
    <div>
      <PageHeader title={translate({ store, source: "Translated Term" })} />
      <div className="page-content">
        <TableView
          model={"translate-term"}
          columnsTable={columns}
          formLayout={({ store, form, onFinish, viewType }) => ViewForm(store, form, onFinish, viewType, dataIds)}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          ids={[{ language: { fields: ["_id", "name", "localeCode"], filter: { active: true } } }]}
          dataIdsCallback={(value: any) => setDataIds(value)}
        />
      </div>
    </div>
  );
};

export default Page;
