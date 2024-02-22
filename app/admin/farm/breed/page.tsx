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
import { getItemInArray } from "@/utils/tool";
import TableView from "@/app/components/data-view/table-view/table-view";
import PageHeader from "@/app/components/body/page-header";
import { filterSearchTable } from "@/app/components/data-view/table-view/filters/filter-search";
import { filterModelTable } from "@/app/components/data-view/table-view/filters/filter-model";

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
        label={translate({ store, source: "Org" })}
        name="idOrg"
        initialValue={dataIds?.["org"]?.[0]?._id}
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <Select
          showSearch
          allowClear
          onClear={() => {
            form.setFieldValue("idOrg", null);
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
        label="Code"
        name="code"
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

      <Form.Item
        label="Breed Category"
        name="idBreedCategory"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <Select
          showSearch
          allowClear
          onClear={() => {
            form.setFieldValue("idBreedCategory", "");
          }}
          filterOption={(input: string, option: any) => {
            return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
          }}
        >
          {(dataIds?.["breed-category"] ?? []).map((e: any) => (
            <Option key={e._id} label={e.name}>
              <span>{e.name}</span>
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Description" name="description">
        <TextArea />
      </Form.Item>

      <Form.Item
        label={translate({ store, source: "Active" })}
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
  const { user } = store.getState();
  const [openModalChangePassword, setOpenModalChangePassword] = useState(false);
  const [idUser, setIdUser] = useState<string>();
  const [dataIds, setDataIds] = useState<any>();

  const columns: ColumnsType<any> = [
    {
      title: "Code",
      dataIndex: "code",
      width: 100,
      key: "code",
      ...filterSearchTable(),
    },
    {
      key: "idOrg",
      title: "Tổ chức",
      width: 200,
      render: (value, record, index) => {
        let org = record.idOrg && getItemInArray(dataIds?.["org"] ?? [], record.idOrg);
        return <div>{org && `${org.shortName} - ${org.name}`}</div>;
      },
      ...filterModelTable({
        fields: ["name"],
        keySelect: "_id",
        keyView: "name",
        model: "org",
        searchKeys: ["name", "shortName"],
      }),
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 160,
      key: "name",
      ...filterSearchTable(),
    },
    {
      title: "Breed Category",
      width: 200,
      render: (value, record, index) => {
        return (
          <div>
            {(record.idBreedCategory &&
              getItemInArray(dataIds?.["breed-category"] ?? [], record.idBreedCategory, "_id")?.name) ??
              ""}
          </div>
        );
      },
      dataIndex: "idBreedCategory",
      key: "idBreedCategory",
      ...filterModelTable({
        fields: ["name"],
        keySelect: "_id",
        keyView: "name",
        model: "breed-category",
        searchKeys: ["name"],
      }),
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

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  return (
    <div>
      <PageHeader title="Breed" />
      <div className="page-content">
        <TableView
          model={"breed"}
          columnsTable={columns}
          formLayout={({ store, form, onFinish, viewType }) => ViewForm(store, form, onFinish, viewType, dataIds)}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          filter={{ idOrg: { $in: user?.idsCurrentOrg ?? [] } }}
          ids={[
            {
              "breed-category": {
                fields: ["_id", "name"],
                filter: { active: true },
              },
            },
            {
              org: {
                fields: ["_id", "name", "shortName"],
                filter: { _id: { $in: user?.idsOrg ?? [] } },
              },
            },
          ]}
          dataIdsCallback={(value) => setDataIds(value)}
        />
        /
      </div>
    </div>
  );
};

export default Page;
