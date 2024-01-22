"use client";
import PageHeader from "@/app/components/body/page-header";
import { StoreContext } from "@/app/components/context-provider";
import One2ManyView from "@/app/components/data-view/o2m-view/o2m-view";
import TableView from "@/app/components/data-view/table-view/table-view";
import { StoreApp } from "@/store/store";
import { translate } from "@/utils/translate";
import { Checkbox, Form, FormInstance, Input, Tabs, Select } from "antd";
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
  const columnsUser: ColumnsType<any> = [
    {
      title: "Username",
      dataIndex: "username",
      width: 200,
      key: "username",
    },
    {
      title: "",
      key: "none",
    },
  ];

  const columnsAccess: ColumnsType<any> = [
    {
      title: "ID",
      dataIndex: "id",
      width: 120,
      key: "id",
      sorter: {
        compare: (a, b) => (a.id ?? ("" as String)).localeCompare(b.id ?? ("" as String)),
        multiple: 1,
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 120,
      key: "name",
      sorter: {
        compare: (a, b) => (a.name ?? ("" as String)).localeCompare(b.name ?? ("" as String)),
        multiple: 2,
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 200,
    },
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
  ];

  const columnsAccessDocument: ColumnsType<any> = [
    {
      title: "ID",
      dataIndex: "id",
      width: 120,
      key: "id",
      sorter: {
        compare: (a, b) => (a.id ?? ("" as String)).localeCompare(b.id ?? ("" as String)),
        multiple: 1,
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 120,
      key: "name",
      sorter: {
        compare: (a, b) => (a.name ?? ("" as String)).localeCompare(b.name ?? ("" as String)),
        multiple: 2,
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 200,
    },
    {
      title: "Apply for Read",
      width: 100,
      align: "center",
      render: (value, record, index) => {
        return <Checkbox checked={record.applyForRead} />;
      },
    },
    {
      title: "Apply for Create",
      width: 100,
      align: "center",
      render: (value, record, index) => {
        return <Checkbox checked={record.applyForCreate} />;
      },
    },
    {
      title: "Apply for Update",
      width: 100,
      align: "center",
      render: (value, record, index) => {
        return <Checkbox checked={record.applyForUpdate} />;
      },
    },
    {
      title: "Apply for Delete",
      width: 100,
      align: "center",
      render: (value, record, index) => {
        return <Checkbox checked={record.applyForDelete} />;
      },
    },
  ];

  return (
    <Form name="form" form={form} layout="vertical" labelWrap onFinish={onFinish}>
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
      <Form.Item label={translate({ store: store, source: "Desciption" })} name="description">
        <TextArea />
      </Form.Item>

      <Form.Item label={translate({ store: store, source: "User" })} name="idsUser" initialValue={[]}>
        <Select
          showSearch
          mode="multiple"
          allowClear
          onClear={() => {
            form.setFieldValue("idsUser", []);
          }}
          filterOption={(input: string, option: any) => {
            return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
          }}
        >
          {(dataIds?.["user"] ?? [])?.map((e: any) => (
            <Option key={e._id} label={`${e.username}-${e.name ?? "(No name)"}`}>
              <span>{`${e.username}-${e.name ?? "(No name)"}`}</span>
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label={translate({ store: store, source: "Menu" })} name="idsMenu" initialValue={[]}>
        <Select
          showSearch
          mode="multiple"
          allowClear
          onClear={() => {
            form.setFieldValue("idsMenu", []);
          }}
          filterOption={(input: string, option: any) => {
            return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
          }}
        >
          {(dataIds?.["menu"] ?? [])?.map((e: any) => (
            <Option key={e._id} label={e.name}>
              <span>{e.name}</span>
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label={translate({ store: store, source: "Access" })} name="idsAccess" initialValue={[]}>
        <Select
          showSearch
          mode="multiple"
          allowClear
          onClear={() => {
            form.setFieldValue("idsAccess", []);
          }}
          filterOption={(input: string, option: any) => {
            return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
          }}
        >
          {(dataIds?.["access"] ?? [])?.map((e: any) => (
            <Option key={e._id} label={e.name}>
              <span>{e.name}</span>
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label={translate({ store: store, source: "Document Access" })}
        name="idsDocumentAccess"
        initialValue={[]}
      >
        <Select
          showSearch
          mode="multiple"
          allowClear
          onClear={() => {
            form.setFieldValue("idsDocumentAccess", []);
          }}
          filterOption={(input: string, option: any) => {
            return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
          }}
        >
          {(dataIds?.["document-access"] ?? [])?.map((e: any) => (
            <Option key={e._id} label={e.name}>
              <span>{e.name}</span>
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label={translate({ store: store, source: "Active" })}
        name="active"
        valuePropName="checked"
        initialValue={true}
      >
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
      title: "ID",
      dataIndex: "id",
      width: 200,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 200,
    },
    {
      title: "Description",
      dataIndex: "description",
      width: 500,
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

  return (
    <div>
      <PageHeader title="Group" />
      <div className="page-content">
        <TableView
          model={"group"}
          columnsTable={columns}
          formLayout={({ store, form, onFinish, viewType }) => ViewForm(store, form, onFinish, viewType, dataIds)}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          updateField="id"
          ids={[
            {
              user: {
                fields: ["_id", "name", "username"],
                filter: { active: true },
              },
            },
            {
              menu: {
                fields: ["_id", "name"],
                filter: { active: true },
              },
            },
            {
              access: {
                fields: ["_id", "name"],
                filter: { active: true },
              },
            },
            {
              "document-access": {
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
