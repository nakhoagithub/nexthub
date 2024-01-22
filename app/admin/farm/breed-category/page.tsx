"use client";
import DataView from "@/app/components/data-view/data-view";
import { Button, Checkbox, Form, FormInstance, Input, InputNumber, Select, Tabs } from "antd";
const { Option } = Select;
import { ColumnsType } from "antd/es/table";
import React, { useContext, useState } from "react";
import { translate } from "@/utils/translate";
import { StoreContext } from "@/app/components/context-provider";
import TextArea from "antd/es/input/TextArea";
import { StoreApi } from "zustand";
import { StoreApp } from "@/store/store";
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
      <Form.Item label={translate({ store, source: "Org" })} name="idsOrg" initialValue={[]}>
        <Select
          showSearch
          mode="multiple"
          allowClear
          onClear={() => {
            form.setFieldValue("idsOrg", []);
          }}
          filterOption={(input: string, option: any) => {
            return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
          }}
        >
          {(dataIds?.["org"] ?? []).map((e: any) => (
            <Option key={e._id} label={e.name}>
              <span>{e.name}</span>
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Description" name="description">
        <TextArea />
      </Form.Item>
      <Form.Item label={translate({ store, source: "Active" })} name="active" valuePropName="checked" initialValue={true}>
        <Checkbox defaultChecked={true}>Active</Checkbox>
      </Form.Item>
    </Form>
  );
};

const Page = () => {
  const store = useContext(StoreContext);
  const { user } = store.getState();
  const [openModalChangePassword, setOpenModalChangePassword] = useState(false);
  const [idUser, setIdUser] = useState<string>();
  const [dataIds, setDataIds] = useState<any>();

  const columns: ColumnsType<any> = [
    {
      title: "Name",
      dataIndex: "name",
      width: 160,
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 800,
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
    <div>
      <PageHeader title="Breed category" />
      <div className="page-content">
        <TableView
          model={"breed-category"}
          columnsTable={columns}
          formLayout={({ store, form, onFinish, viewType }) => ViewForm(store, form, onFinish, viewType, dataIds)}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          filter={{
            $or: [{ idsOrg: { $in: user?.idsCurrentOrg ?? [] } }, { idsOrg: [] }],
          }}
          ids={[
            {
              org: {
                fields: ["_id", "name"],
                filter: { _id: { $in: user?.idsOrg ?? [] } },
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
