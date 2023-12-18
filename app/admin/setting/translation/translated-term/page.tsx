"use client";
import { StoreContext } from "@/app/components/context-provider";
import DataView from "@/app/components/data-view/data-view";
import { translate } from "@/utils/translate";
import { Checkbox, Form, FormInstance, Input, Select } from "antd";
const { Option } = Select;
import { ColumnsType } from "antd/es/table";
import React, { useContext, useState } from "react";

const ViewForm = (
  form: FormInstance<any>,
  onFinish: (value: any) => void,
  viewType: string,
  disabledForm?: boolean,
  dataIds?: any
) => {
  const store = useContext(StoreContext);
  return (
    <Form name="form" form={form} layout="vertical" labelWrap style={{ width: 800 }} onFinish={onFinish}>
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
  const [dataIds, setDataIds] = useState<any>();
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
    <DataView
      model="translate-term"
      titleHeader="Translated Term"
      columnsTable={columns}
      tableBoder={true}
      formLayout={(form, onFinish, viewType, disableForm) => ViewForm(form, onFinish, viewType, disableForm, dataIds)}
      ids={[{ language: { fields: ["_id", "name", "localeCode"], filter: { active: true } } }]}
      dataIdsCallback={(value: any) => setDataIds(value)}
    />
  );
};

export default Page;
