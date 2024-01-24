"use client";
import { Checkbox, DatePicker, Form, FormInstance, Input, InputNumber, Select, Space, Tabs } from "antd";
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
import dayjs from "dayjs";

const ViewForm = (
  store: StoreApi<StoreApp>,
  form: FormInstance<any>,
  onFinish: (value: any) => void,
  viewType: string | null,
  dataIds: any
) => {
  function onChangeNumOfDay() {
    let num = form.getFieldValue("numOfDays");
    let dateStart = form.getFieldValue("dateStart")?.unix() ?? 0;
    if (num !== undefined) {
      let dateEnd = dateStart + 86400 * num;
      form.setFieldValue("dateEnd", dayjs.unix(dateEnd - 86400));
    }
  }

  function onChangeDate() {
    let dateEnd = form.getFieldValue("dateEnd")?.startOf("day").unix() ?? 0;
    let dateStart = form.getFieldValue("dateStart")?.startOf("day").unix() ?? 0;

    if (!dateStart) {
      form.setFieldValue("numOfDays", undefined);
      return;
    }

    if (dateEnd) {
      let numOfDay = (dateEnd - dateStart) / 86400 + 1;
      if (numOfDay <= 0) {
        form.setFieldValue("numOfDays", undefined);
      } else {
        form.setFieldValue("numOfDays", numOfDay);
      }
    }
  }

  return (
    <Form name="form" form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label={translate({ store, source: "Name" })}
        name="name"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <Input />
      </Form.Item>

      <Space>
        <Form.Item
          label={translate({ store, source: "Number of days" })}
          name="numOfDays"
          initialValue={1}
          rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
        >
          <InputNumber min={1} onChange={() => onChangeNumOfDay()} />
        </Form.Item>
      </Space>

      <Form.Item
        label={translate({ store, source: "Date start" })}
        name="dateStart"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <DatePicker format="DD/MM/YYYY" disabled />
      </Form.Item>

      <Form.Item
        label={translate({ store, source: "Date end" })}
        name="dateEnd"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <DatePicker format="DD/MM/YYYY" onChange={() => onChangeDate()} />
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
      key: "idPlantingSchedule",
      title: translate({ store, source: "Planting schedule" }),
      width: 300,
      render: (value, record, index) => {
        let data =
          record.idPlantingSchedule &&
          getItemInArray(dataIds?.["planting-schedule"] ?? [], record.idPlantingSchedule, "_id");
        return <div>{data?.code ?? ""}</div>;
      },
      filters: [
        ...(dataIds?.["planting-schedule"] ?? []).map((e: any) => {
          return {
            value: e._id,
            text: e.code,
          };
        }),
      ],
      filterSearch: true,
    },
    {
      title: translate({ store, source: "Number of days" }),
      dataIndex: "numOfDays",
      width: 100,
      align: "center",
    },
    {
      title: translate({ store, source: "Date start" }),
      width: 120,
      align: "center",
      render: (value, record, index) => {
        return <>{record.dateStart && dayjs.unix(record.dateStart).format("DD/MM/YYYY")}</>;
      },
    },
    {
      title: translate({ store, source: "Date end" }),
      width: 120,
      align: "center",
      render: (value, record, index) => {
        return <>{record.dateEnd && dayjs.unix(record.dateEnd).format("DD/MM/YYYY")}</>;
      },
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
  ];

  return (
    <div>
      <PageHeader title="Period of planting schedule" />
      <div className="page-content">
        <TableView
          model="period-planting-schedule-detail"
          columnsTable={columns}
          formLayout={({ store, form, onFinish, viewType }) => ViewForm(store, form, onFinish, viewType, dataIds)}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          sort={{ idPlantingSchedule: 1, sortIndex: 1 }}
          customValuesInit={(values: any) => {
            // date start
            let dateStart = dayjs.unix(values.dateStart ?? 0);
            let dateEnd = dayjs.unix(values.dateEnd ?? 0);

            let newValues = { ...values, dateStart, dateEnd };
            return newValues;
          }}
          customValuesFinish={(values: any) => {
            let dateStart = !values?.dateStart
              ? dayjs().startOf("day").unix()
              : dayjs(values?.dateStart).startOf("day").unix();

            let dateEnd = !values?.dateEnd
              ? dayjs().startOf("day").unix()
              : dayjs(values?.dateEnd).startOf("day").unix();

            let newValues = { ...values, dateStart, dateEnd };
            return newValues;
          }}
          ids={[
            {
              "planting-schedule": {
                fields: ["_id", "code"],
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
