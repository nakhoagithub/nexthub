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

const ViewForm = (
  store: StoreApi<StoreApp>,
  form: FormInstance<any>,
  onFinish: (value: any) => void,
  viewType: string,
  dataIds: any
) => {
  return (
    <Form name="form" form={form} layout="vertical" style={{ width: 600 }} onFinish={onFinish}>
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

      <Form.Item label="ID Parent" name="idParent">
        <Select
          allowClear
          onClear={() => {
            form.setFieldValue("idParent", "");
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
          allowClear
          onClear={() => {
            form.setFieldValue("idFarm", "");
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
  const [openModalChangePassword, setOpenModalChangePassword] = useState(false);
  const [idUser, setIdUser] = useState<string>();
  const [dataIds, setDataIds] = useState<any>();

  const columns: ColumnsType<any> = [
    {
      title: "ID",
      dataIndex: "id",
      width: 100,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 160,
    },
    {
      title: "Farm",
      width: 200,
      render: (value, record, index) => {
        return <div>{record.idFarm && getItemInArray(dataIds?.["farm"] ?? [], record.idFarm, "_id")?.name}</div>;
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 300,
    },
    { title: "", key: "none" },
    {
      title: "Sort Index",
      dataIndex: "sortIndex",
      width: 100,
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
      <DataView
        model="area"
        titleHeader="Area"
        columnsTable={columns}
        tableBoder={true}
        formLayout={({store, form, onFinish, viewType}) => ViewForm(store, form, onFinish, viewType, dataIds)}
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
  );
};

export default Page;
