"use client";
import { Checkbox, Form, FormInstance, Input, InputNumber, Select, Space, Tabs } from "antd";
const { Option } = Select;
import { ColumnsType } from "antd/es/table";
import React, { useContext, useState } from "react";
import { translate } from "@/utils/translate";
import { StoreContext } from "@/app/components/context-provider";
import { StoreApi } from "zustand";
import { StoreApp } from "@/store/store";
import { getItemInArray } from "@/utils/tool";
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
      <Form.Item
        label={translate({ store, source: "Name" })}
        name="name"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={translate({ store, source: "Sample planting schedule" })}
        name="idSamplePlantingSchedule"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <Select
          showSearch
          allowClear
          onClear={() => {
            form.setFieldValue("idSamplePlantingSchedule", "");
          }}
          filterOption={(input: string, option: any) => {
            return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
          }}
        >
          {(dataIds?.["sample-planting-schedule"] ?? []).map((e: any) => (
            <Option key={e._id} label={e.name}>
              <span>{e.name}</span>
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Space>
        <Form.Item
          label={translate({ store, source: "Sort index" })}
          name="sortIndex"
          rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label={translate({ store, source: "Number of days" })}
          name="numOfDays"
          initialValue={1}
          rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
        >
          <InputNumber min={0} /> 
        </Form.Item>
      </Space>

      <Form.Item name="isStart" valuePropName="checked" initialValue={false}>
        <Checkbox>{translate({ store, modelName: "sample-period-planting-schedule", source: "Is start" })}</Checkbox>
      </Form.Item>

      <Form.Item name="active" valuePropName="checked" initialValue={true}>
        <Checkbox defaultChecked={true}>{translate({ store, source: "Active" })}</Checkbox>
      </Form.Item>
    </Form>
  );
};

const Page = () => {
  const store = useContext(StoreContext);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [dataIds, setDataIds] = useState<any>();

  const columns: ColumnsType<any> = [
    {
      title: translate({ store, source: "Name" }),
      dataIndex: "name",
      width: 200,
    },
    {
      key: "idSamplePlantingSchedule",
      title: translate({ store, source: "Sample planting schedule" }),
      width: 300,
      render: (value, record, index) => {
        let data =
          record.idSamplePlantingSchedule &&
          getItemInArray(dataIds?.["sample-planting-schedule"] ?? [], record.idSamplePlantingSchedule, "_id");
        return <div>{data?.name ?? ""}</div>;
      },
      filters: [
        ...(dataIds?.["sample-planting-schedule"] ?? []).map((e: any) => {
          return {
            value: e._id,
            text: e.name,
          };
        }),
      ],
      filterSearch: true,
    },
    {
      title: translate({ store, source: "Sort index" }),
      dataIndex: "sortIndex",
      width: 100,
      align: "center",
    },
    {
      title: translate({ store, source: "Number of days" }),
      dataIndex: "numOfDays",
      width: 100,
      align: "center",
    },
    {
      title: translate({ store, source: "Is start" }),
      width: 100,
      dataIndex: "isStart",
      align: "center",
      render: (value, record, index) => {
        return <Checkbox checked={record.isStart} />;
      },
    },
    { title: "", key: "none" },
    {
      title: translate({ store, source: "Active" }),
      width: 100,
      align: "center",
      render: (value, record, index) => {
        return <Checkbox checked={record.active} />;
      },
    },
  ];

  const columnsPeriod: ColumnsType<any> = [
    {
      title: translate({ store, source: "Period Name" }),
      dataIndex: "name",
      width: 200,
      key: "name",
    },
    {
      title: translate({ store, source: "Number of days" }),
      dataIndex: "numOfDays",
      width: 200,
    },
    {
      title: translate({ store, source: "Sort Index" }),
      dataIndex: "sortIndex",
      width: 100,
      align: "center",
    },
    {
      title: "",
      key: "none",
    },
  ];

  return (
    <div>
      <PageHeader title="Sample period of planting schedule" />
      <div className="page-content">
        <TableView
          model="sample-period-planting-schedule"
          columnsTable={columns}
          formLayout={({ store, form, onFinish, viewType }) => ViewForm(store, form, onFinish, viewType, dataIds)}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          sort={{ idSamplePlantingSchedule: 1, sortIndex: 1 }}
          ids={[
            {
              "sample-planting-schedule": {
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
