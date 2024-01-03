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
import TableView from "@/app/components/data-view/table-view/table-view";

const ViewForm = (
  store: StoreApi<StoreApp>,
  form: FormInstance<any>,
  onFinish: (value: any) => void,
  viewType: string | null,
  dataIds: any
) => {
  const columnsOrg: ColumnsType<any> = [
    {
      title: "Name",
      dataIndex: "name",
      width: 200,
      key: "name",
    },
    {
      title: "Short name",
      dataIndex: "shortName",
      width: 160,
      key: "name",
    },
    {
      title: "",
      key: "none",
    },
  ];

  return (
    <Form name="form" form={form} layout="vertical" onFinish={onFinish}>
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
      <Form.Item label="Address" name="address">
        <TextArea />
      </Form.Item>
      <Form.Item label="IP Public" name="ipPublic">
        <Input />
      </Form.Item>
      <Form.Item label="IP Private" name="ipPrivate">
        <Input />
      </Form.Item>
      <Form.Item label="Port" name="port" initialValue={27017}>
        <InputNumber min={1} max={65536} value={27017} />
      </Form.Item>
      <Form.Item label="Username" name="username">
        <Input />
      </Form.Item>
      <Form.Item label="Password" name="password">
        <Input.Password />
      </Form.Item>
      <Form.Item label="Database Name" name="database">
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
      title: "Address",
      dataIndex: "address",
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

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  return (
    <div className="page-content">
      <TableView
        model={"farm"}
        // columnsView={[
        //   { field: "name", title: "Name" },
        //   { field: "state", title: "State" },
        //   { field: "idsOrg", title: "Orgs" },
        //   { field: "active", title: "Active" },
        // ]}
        columnsView={[
          { field: "id", title: translate({ store, source: "ID" }), width: 160 },
          { field: "name", title: translate({ store, source: "Name" }), width: 200 },
          { field: "address", title: translate({ store, source: "Address" }), width: 300 },
          { field: "ipPublic", title: translate({ store, source: "IP Public" }), width: 200 },
          { field: "ipPrivate", title: translate({ store, source: "IP Private" }), width: 200 },
          { field: "port", title: translate({ store, source: "Port" }), width: 100 },
          { field: "username", title: translate({ store, source: "Username" }), width: 200 },
          { field: "password", title: translate({ store, source: "Password" }), width: 200 },
          { field: "database", title: translate({ store, source: "Database" }), width: 200 },
          {
            field: "active",
            title: translate({ store, source: "Active" }),
            width: 100,
            renderItem(item, index) {
              return <Checkbox checked={item.active} />;
            },
          },
        ]}
        formLayout={({ store, form, onFinish, viewType }) => ViewForm(store, form, onFinish, viewType, dataIds)}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        updateField="id"
      />
      {/* <DataView
        model="farm"
        titleHeader="Farm"
        columnsTable={columns}
        tableBoder={true}
        formLayout={({ store, form, onFinish, viewType }) => ViewForm(store, form, onFinish, viewType, dataIds)}
        ids={[
          {
            org: {
              fields: ["_id", "name"],
              filter: { active: true },
            },
          },
        ]}
        dataIdsCallback={(value) => setDataIds(value)}
        actions={(keys?: any[]) => [
          <div>{keys?.length === 1 && <Button onClick={() => {}}>Update to Server IoT</Button>}</div>,
        ]}
      /> */}
    </div>
  );
};

export default Page;
