"use client";
import { StoreContext } from "@/app/components/context-provider";
import DataView from "@/app/components/data-view/data-view";
import One2ManyView from "@/app/components/data-view/o2m-view/o2m-view";
import { AccessRightModel } from "@/interfaces/access-right-model";
import { StoreApp } from "@/store/store";
import { translate } from "@/utils/translate";
import { Checkbox, Form, FormInstance, Input, Tabs } from "antd";
import TextArea from "antd/es/input/TextArea";
import { ColumnsType } from "antd/es/table";
import React, { useContext } from "react";
import { StoreApi } from "zustand";

const ViewForm = (
  store: StoreApi<StoreApp>,
  form: FormInstance<any>,
  onFinish: (value: any) => void,
  viewType: string,
  disabledForm?: boolean
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

  const columnsMenu: ColumnsType<any> = [
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
      width: 160,
      key: "name",
      sorter: {
        compare: (a, b) => (a.name ?? ("" as String)).localeCompare(b.name ?? ("" as String)),
        multiple: 2,
      },
    },
    {
      title: "Url",
      dataIndex: "url",
      key: "url",
      sorter: {
        compare: (a, b) => (a.url ?? ("" as String)).localeCompare(b.url ?? ("" as String)),
        multiple: 3,
      },
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
  ];

  return (
    <Form name="form" form={form} layout="vertical" labelWrap style={{ width: 800 }} onFinish={onFinish}>
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
      <Form.Item label="Description" name="description">
        <TextArea />
      </Form.Item>
      <Form.Item label="Active" name="active" valuePropName="checked" initialValue={true}>
        <Checkbox defaultChecked={true}>Active</Checkbox>
      </Form.Item>
      <Tabs
        type="card"
        items={[
          {
            forceRender: true,
            label: "User",
            key: "user",
            children: (
              <One2ManyView
                showAdd
                idsField="idsUser"
                titleModel="User"
                model="group"
                toModel="user"
                columnsTable={columnsUser}
                form={form}
              />
            ),
          },
          {
            forceRender: true,
            label: "Menu",
            key: "menu",
            children: (
              <One2ManyView
                showAdd
                idsField="idsMenu"
                titleModel="Menu"
                model="group"
                toModel="menu"
                columnsTable={columnsMenu}
                form={form}
              />
            ),
          },
          {
            forceRender: true,
            label: "Access",
            key: "access",
            children: (
              <One2ManyView
                showAdd
                idsField="idsAccess"
                titleModel="Access"
                model="group"
                toModel="access"
                columnsTable={columnsAccess}
                form={form}
              />
            ),
          },
          {
            forceRender: true,
            label: "Document Access",
            key: "document-access",
            children: (
              <One2ManyView
                showAdd
                idsField="idsDocumentAccess"
                titleModel="Document Access"
                model="group"
                toModel="document-access"
                columnsTable={columnsAccessDocument}
                form={form}
              />
            ),
          },
        ]}
      />
    </Form>
  );
};

const Page = () => {
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
    <DataView
      model="group"
      titleHeader="Group"
      columnsTable={columns}
      tableBoder={true}
      formLayout={({ store, form, onFinish, viewType, disabled }) => ViewForm(store, form, onFinish, viewType, disabled)}
      updateField="id"
    />
  );
};

export default Page;
