"use client";
import { Checkbox, DatePicker, Form, FormInstance, Input, InputNumber, Select, Space, Tabs } from "antd";
const { Option } = Select;
import { ColumnsType } from "antd/es/table";
import React, { useContext, useEffect, useState } from "react";
import { translate } from "@/utils/translate";
import { StoreContext } from "@/app/components/context-provider";
import TextArea from "antd/es/input/TextArea";
import { StoreApi } from "zustand";
import { StoreApp } from "@/store/store";
import { getItemInArray } from "@/utils/tool";
import PageHeader from "@/app/components/body/page-header";
import { getDatas } from "@/utils/crud";
import dayjs from "dayjs";
import { useForm } from "antd/es/form/Form";

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
          showSearch
          allowClear
          onClear={() => {
            form.setFieldValue("idBreed", "");
          }}
          filterOption={(input: string, option: any) => {
            return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
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
        <Form.Item
          label={translate({ store, source: "Number of days incurred" })}
          name="numOfDaysIncurred"
          initialValue={0}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item label={translate({ store, source: "Average Yield" })} name="averageYield" initialValue={0}>
          <InputNumber min={0} />
        </Form.Item>
      </Space>

      <Form.Item label={translate({ store, source: "Description" })} name="description">
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
  const [loading, setLoading] = useState(false);
  const [dataIds, setDataIds] = useState<any>();
  const [areas, setAreas] = useState<any[]>([]);
  const [plantingSchedules, setPlantingSchedules] = useState<any[]>([]);
  const [daysInMonth, setDaysInMonth] = useState<number[]>([]);
  const [form] = useForm();
  const [month, setMonth] = useState<dayjs.Dayjs | undefined>(undefined);

  async function fetchData() {
    setLoading(true);
    let areaResp = await getDatas({ model: "area", fields: ["name", "_id"] });
    setAreas(areaResp?.datas ?? []);
    let planResp = await getDatas({ model: "planting-schedule", fields: ["code", "_id"] });
    setPlantingSchedules(planResp?.datas ?? []);
    setLoading(false);
  }

  function onChangeMonth(value: any) {
    let monthDayjs = dayjs(value);
    setMonth(monthDayjs);
    let daysInMonth = [];
    for (var i = 0; i < monthDayjs.daysInMonth(); i++) {
      daysInMonth.push(i + 1);
    }
    setDaysInMonth(daysInMonth);
  }

  function initMonth() {
    let date = dayjs();
    form.setFieldValue("month", date);
    onChangeMonth(date);
  }

  useEffect(() => {
    fetchData();
    initMonth();
  }, []);

  return (
    <div>
      <PageHeader title="Production document" />
      <div className="page-content">
        <Form layout="vertical" form={form}>
          <Space wrap>
            <Form.Item
              style={{ minWidth: 300 }}
              label={translate({ source: "Planting schedule", store })}
              name="idPlantingSchedule"
            >
              <Select
                showSearch
                allowClear
                onClear={() => {
                  // form.setFieldValue("idArea", "");
                }}
                filterOption={(input: string, option: any) => {
                  return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
                }}
              >
                {plantingSchedules.map((e: any) => (
                  <Option key={e._id} label={e.code}>
                    <span>{`${e.code}`}</span>
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item style={{ minWidth: 300 }} label={translate({ source: "Area", store })} name="idArea">
              <Select
                showSearch
                allowClear
                onClear={() => {
                  // form.setFieldValue("idArea", "");
                }}
                filterOption={(input: string, option: any) => {
                  return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
                }}
              >
                {areas.map((e: any) => (
                  <Option key={e._id} label={e.name}>
                    <span>{`${e.name}`}</span>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item style={{ minWidth: 140 }} label={translate({ source: "Date", store })} name="date">
              <Select
                showSearch
                allowClear
                onClear={() => {
                  // form.setFieldValue("idArea", "");
                }}
                filterOption={(input: string, option: any) => {
                  return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
                }}
              >
                {daysInMonth.map((e: any) => (
                  <Option key={e} label={e}>
                    <span>{`Ngày ${e}`}</span>
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label={translate({ source: "Month", store })} name="month">
              <DatePicker format={"MM/YYYY"} picker="month" onChange={onChangeMonth} />
            </Form.Item>
          </Space>
        </Form>
      </div>
      <div className="page-content">
        <Tabs
          type="card"
          items={[
            {
              key: "work-diary",
              label: translate({ source: "Work diary", store }),
              children: <></>,
            },
            {
              key: "garden-check-diary",
              label: translate({ source: "Garden check diary", store }),
              children: <></>,
            },
            {
              key: "disease-management",
              label: translate({ source: "Disease management", store }),
              children: <></>,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Page;
