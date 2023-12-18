"use client";
import { StoreContext } from "@/app/components/context-provider";
import DataView from "@/app/components/data-view/data-view";
import { translate } from "@/utils/translate";
import { Avatar, Button, Card, Checkbox, Form, FormInstance, Input, Select, Space } from "antd";
import Meta from "antd/es/card/Meta";
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
        rules={[
          {
            required: true,
            message: translate({ store: store, source: "This field cannot be left blank" }),
          },
        ]}
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
  const store = useContext(StoreContext);
  const columns: ColumnsType<any> = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   width: 200,
    // },
    {
      title: translate({ store: store, source: "Source term" }),
      dataIndex: "sourceTerm",
      width: 500,
    },
    {
      title: translate({ store: store, source: "Translate Value" }),
      dataIndex: "translationValue",
      width: 500,
    },
    {
      title: translate({ store: store, source: "Locale Code" }),
      dataIndex: "localeCode",
      width: 100,
    },
    {
      title: translate({ store: store, source: "Model Name" }),
      dataIndex: "modelName",
      width: 200,
    },
    { title: "", key: "none" },
    {
      title: translate({ store: store, source: "Active" }),
      width: 100,
      align: "center",
      render: (value: any, record: any, index: number) => {
        return <Checkbox checked={record.active} />;
      },
    },
  ];

  return (
    <DataView
      model="module"
      titleHeader="Module"
      hideActionCreate
      renderItemKanban={(value: any, index: number) => (
        <Card style={{ height: "160px", flexDirection: "column", display: "flex", justifyContent: "space-between" }}>
          <Meta
            avatar={<Avatar src="" />}
            title={translate({ store: store, source: value.name ?? "(Module name)" })}
            description={translate({ store: store, source: value.description ?? "" })}
          />
          <Space style={{ marginTop: "20px" }}>
            <Button type="primary" disabled={value.state === "base"}>
              {value.install
                ? translate({ store: store, source: "Uninstall" })
                : translate({ store: store, source: "Install" })}
            </Button>
            {/* <Button>Info</Button> */}
          </Space>
        </Card>
      )}
    />
  );
};

export default Page;
