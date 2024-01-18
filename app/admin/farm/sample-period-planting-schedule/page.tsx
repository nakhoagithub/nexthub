"use client";
import { Checkbox, Form, FormInstance, Input, InputNumber, Select, Space, Tabs } from "antd";
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
              <span>{`${e.code} - ${e.name}`}</span>
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
      title: translate({ store, source: "Number of day incurred" }),
      dataIndex: "numOfDaysIncurred",
      width: 100,
      align: "center",
    },
    {
      title: translate({ store, source: "Average Yield" }),
      dataIndex: "averageYield",
      width: 100,
      align: "center",
    },
    {
      title: translate({ store, source: "Breed" }),
      width: 300,
      render: (value, record, index) => {
        let breed = record.idBreed && getItemInArray(dataIds?.["breed"] ?? [], record.idBreed, "_id");
        return <div>{breed && `${breed?.code} - ${breed?.name}`}</div>;
      },
    },
    {
      title: translate({ store, source: "Description" }),
      dataIndex: "description",
      width: 500,
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
      <PageHeader title={translate({ store, source: "Template planting schedule" })} />
      <div className="page-content">
        <TableView
          model={"template-planting-schedule"}
          columnsTable={columns}
          formLayout={({ store, form, onFinish, viewType }) => ViewForm(store, form, onFinish, viewType, dataIds)}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          ids={[
            {
              breed: {
                fields: ["_id", "name", "code"],
                filter: { active: true },
              },
            },
          ]}
          dataIdsCallback={(value) => setDataIds(value)}
          // actions={(keys?: any[]) => [
          //   <div>
          //     {keys?.length === 1 && <Button onClick={() => {}}>{translate({ store, source: "Add Period" })}</Button>}
          //   </div>,
          // ]}
          // modelExpandable="template-planting-schedule-period"
          // fieldExpandable="idsPeriod"
          // columnsExpandable={columnsPeriod}
        />
      </div>
    </div>
  );
};

export default Page;
