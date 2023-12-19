"use client";
import DataView from "@/app/components/data-view/data-view";
import { Button, Checkbox, Form, FormInstance, Input, InputNumber, Select, Space, Tabs } from "antd";
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
import TableView from "@/app/components/data-view/data-view/table-view";

const ViewFormAddPeriodInLine = () => {
  return <Form></Form>;
};

const ViewForm = (
  store: StoreApi<StoreApp>,
  form: FormInstance<any>,
  onFinish: (value: any) => void,
  viewType: string,
  dataIds: any
) => {
  const columnsPeriod: ColumnsType<any> = [
    {
      title: "Name",
      dataIndex: "name",
      width: 200,
      key: "name",
    },
    {
      title: "Number of days",
      dataIndex: "numOfDays",
      width: 100,
    },
    {
      title: "Sort Index",
      dataIndex: "sortIndex",
      width: 100,
    },
    {
      title: "",
      key: "none",
    },
  ];

  return (
    <Form name="form" form={form} layout="vertical" style={{ width: 600 }} onFinish={onFinish}>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Breed"
        name="idBreed"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <Select
          allowClear
          onClear={() => {
            form.setFieldValue("idBreed", "");
          }}
        >
          {(dataIds?.["breed"] ?? []).map((e: any) => (
            <Option key={e._id} label={e.name}>
              <span>{e.name}</span>
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Space>
        <Form.Item label={translate({ store, source: "Number of days incurred" })} name="numOfDaysIncurred">
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item label={translate({ store, source: "Average Yield" })} name="averageYield">
          <InputNumber min={0} />
        </Form.Item>
      </Space>

      <Form.Item label={translate({ store, source: "Description" })} name="description">
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
            label: "Period",
            key: "period",
            children: (
              <One2ManyView
                showAdd
                idsField="idsPeriod"
                titleModel="Period"
                model="template-planting-schedule"
                toModel="template-planting-schedule-period"
                columnsTable={columnsPeriod}
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
  const [openModalChangePassword, setOpenModalChangePassword] = useState(false);
  const [idUser, setIdUser] = useState<string>();
  const [dataIds, setDataIds] = useState<any>();

  const columns: ColumnsType<any> = [
    {
      title: "Name",
      dataIndex: "name",
      width: 200,
    },
    {
      title: "Number of day incurred",
      dataIndex: "numOfDaysIncurred",
      width: 100,
    },
    {
      title: "Average Yield",
      dataIndex: "averageYield",
      width: 100,
    },
    {
      title: "Breed",
      width: 300,
      render: (value, record, index) => {
        return (
          <div>{(record.idBreed && getItemInArray(dataIds?.["breed"] ?? [], record.idBreed, "_id")?.name) ?? ""}</div>
        );
      },
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
    <div className="page-content">
      <TableView
        model={"menu"}
        // columnsView={[
        //   { field: "name", title: "Name" },
        //   { field: "state", title: "State" },
        //   { field: "idsOrg", title: "Orgs" },
        //   { field: "active", title: "Active" },
        // ]}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      />
      {/* <DataView
        model="template-planting-schedule"
        titleHeader="Template Planting Schedule"
        columnsTable={columns}
        tableBoder={true}
        formLayout={({ store, form, onFinish, viewType }) => ViewForm(store, form, onFinish, viewType, dataIds)}
        ids={[
          {
            breed: {
              fields: ["_id", "name"],
              filter: { active: true },
            },
          },
        ]}
        dataIdsCallback={(value) => setDataIds(value)}
      /> */}
    </div>
  );
};

export default Page;
