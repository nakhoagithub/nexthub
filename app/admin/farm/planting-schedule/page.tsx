"use client";
import { Checkbox, DatePicker, Form, FormInstance, Input, InputNumber, Select, Space, Tabs, Tag } from "antd";
const { Option } = Select;
import { ColumnsType } from "antd/es/table";
import React, { useContext, useEffect, useState } from "react";
import { translate } from "@/utils/translate";
import { StoreContext } from "@/app/components/context-provider";
import TextArea from "antd/es/input/TextArea";
import { StoreApi } from "zustand";
import { StoreApp } from "@/store/store";
import { getItemInArray } from "@/utils/tool";
import TableView from "@/app/components/data-view/table-view/table-view";
import PageHeader from "@/app/components/body/page-header";
import moment from "moment";
import dayjs from "dayjs";
import FilterDropdown from "@/app/components/data-view/table-view/filter-dropdown";

const ViewForm = (
  store: StoreApi<StoreApp>,
  form: FormInstance<any>,
  onFinish: (value: any) => void,
  viewType: string | null,
  dataIds: any,
  initSamples: any[],
  dataDistincts: any
) => {
  const [samples, setSamples] = useState<any[]>([]);

  function changeCode() {
    let area = getItemInArray(dataIds?.["area"] ?? [], form.getFieldValue("idArea") ?? "");
    let farm = (dataIds?.["farm"] ?? []).find((e: any) => e._id === area?.idFarm);
    let numberOfSeasons = form.getFieldValue("numberOfSeasons") ?? "";
    let areaCode = area?.id ?? "";
    let breedCode = getItemInArray(dataIds?.["breed"] ?? [], form.getFieldValue("idBreed") ?? "")?.code ?? "";
    let dateCode = form.getFieldValue("dateStartPlanting")?.format("YYYY") ?? "";
    let code = `${farm?.id}-${areaCode}-${breedCode}-V${numberOfSeasons}-${dateCode}`;
    if (
      form.getFieldValue("numberOfSeasons") !== undefined &&
      form.getFieldValue("idArea") !== undefined &&
      form.getFieldValue("idBreed") !== undefined &&
      form.getFieldValue("dateStartPlanting") !== undefined &&
      form.getFieldValue("code") === undefined
    ) {
      form.setFieldValue("code", code);
    }
  }

  function onChangeBreed(value: any) {
    changeCode();

    if (value) {
      let newSamples = (dataIds?.["sample-planting-schedule"] ?? []).filter((e: any) => e.idBreed === value);
      setSamples(newSamples);
    } else {
      setSamples([]);
    }
    form.setFieldValue("idSamplePlantingSchedule", undefined);
  }

  function onChangeNumberOfPlants() {
    // let numberOfPlants = form.getFieldValue("numberOfPlants");
    // let idTemplate = form.getFieldValue("id_template");
    // let averageYield = templates.find((e: any) => e._id === idTemplate)?.average_yield;
    // if (numberOfPlants !== null && averageYield) {
    //   let newQuantityExpected = (80 / 100) * averageYield * numberOfPlants;
    //   form.setFieldValue("quantity_expected", Number(newQuantityExpected.toFixed(2)));
    // } else {
    //   form.setFieldValue("quantity_expected", null);
    // }
  }

  useEffect(() => {
    if (viewType == "update") {
      setSamples(initSamples);
    } else {
      setSamples([]);
    }
  }, [viewType, initSamples]);

  return (
    <Form name="form" form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label={translate({ store, source: "Season code" })}
        name="code"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
        extra={"Mã nông trại - Mã nhà - Mã giống - Vụ - Năm"}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={translate({ store, source: "Area" })}
        name="idArea"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <Select
          showSearch
          allowClear
          onClear={() => {
            form.setFieldValue("idArea", "");
          }}
          filterOption={(input: string, option: any) => {
            return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
          }}
          onChange={() => changeCode()}
        >
          {(dataIds?.["area"] ?? []).map((e: any) => (
            <Option key={e._id} label={e.name}>
              <span>{e.name}</span>
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label={translate({ store, source: "Number of seasons" })}
        name="numberOfSeasons"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <InputNumber min={0} onChange={() => changeCode()} />
      </Form.Item>

      <Form.Item
        label={translate({ store, source: "Breed" })}
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
          onChange={onChangeBreed}
          disabled={viewType == "update"}
        >
          {(dataIds?.["breed"] ?? []).map((e: any) => (
            <Option key={e._id} label={e.name}>
              <span>{`${e.code} - ${e.name}`}</span>
            </Option>
          ))}
        </Select>
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
            form.setFieldValue("idSamplePlantingSchedule", undefined);
          }}
          filterOption={(input: string, option: any) => {
            return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
          }}
          disabled={viewType == "update"}
        >
          {samples.map((e: any) => (
            <Option key={e._id} label={e.name}>
              <span>{e.name}</span>
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label={translate({ store, source: "Date start planting" })}
        name="dateStartPlanting"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <DatePicker format="DD/MM/YYYY" onChange={() => changeCode()} />
      </Form.Item>

      <Space wrap>
        <Form.Item
          label={translate({ store, source: "Actual number of plants" })}
          name="actualNumberOfPlants"
          initialValue={0}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item label={translate({ store, source: "Total of plants" })} name="totalOfPlants" initialValue={0}>
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item label={translate({ store, source: "Quantity" })} name="quantity" initialValue={0}>
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label={translate({ store, source: "Quantity exprected" })}
          name="quantityExpected"
          extra={
            <div>
              <b>Tự động tính với công thức:</b> 80% * Sản lượng trung bình/cây (hoặc trái) * Số lượng cây trồng thực tế
            </div>
          }
          initialValue={0}
        >
          <InputNumber min={0} disabled />
        </Form.Item>
      </Space>

      <Form.Item label={translate({ store, source: "Comment" })} name="comment">
        <TextArea />
      </Form.Item>

      <Form.Item
        label={translate({ store, source: "Date start production document" })}
        name="dateStartProductionDocument"
        // rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <DatePicker format="DD/MM/YYYY" />
      </Form.Item>

      <Form.Item
        label={translate({ store, source: "Date end production document" })}
        name="dateEndProductionDocument"
        // rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <DatePicker format="DD/MM/YYYY" />
      </Form.Item>
    </Form>
  );
};

const Page = () => {
  const store = useContext(StoreContext);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [dataIds, setDataIds] = useState<any>();
  const [dataDistincts, setDataDistincts] = useState<any>();
  const [initSamples, setInitSamples] = useState<any[]>([]);

  function statusPlan(record: any) {
    switch (record.status) {
      case "create":
        return <Tag>Kế hoạch</Tag>;
      case "running":
        return <Tag color="green">Đang gieo trồng</Tag>;
      case "stop":
        return <Tag color="red">Hủy</Tag>;
      case "complete":
        return <Tag color="blue">Đã thu hoạch</Tag>;
    }
    return <></>;
  }

  let a = [];

  for (let i = 0; i < 1000; i++) {
    a.push(i);
  }

  const columns: ColumnsType<any> = [
    {
      title: translate({ store, source: "Season code" }),
      dataIndex: "code",
      width: 200,
      align: "center",
      fixed: "left",
    },
    {
      title: translate({ store, source: "Seeding day" }),
      width: 120,
      align: "center",
      render: (value, record, index) => {
        return <>{record.seedingDate && dayjs.unix(record.seedingDate).format("DD/MM/YYYY")}</>;
      },
    },
    {
      title: translate({ store, source: "Harvest date" }),
      width: 120,
      align: "center",
      render: (value, record, index) => {
        return <>{record.harvestDate && dayjs.unix(record.harvestDate).format("DD/MM/YYYY")}</>;
      },
      // filters: [
      //   ...a.map((e, index) => {
      //     return {
      //       value: e,
      //       text: `${index}`,
      //     };
      //   }),
      // ],
      // filterDropdown: (props) => FilterDropdown({ props }),
    },
    {
      title: translate({ store, source: "Year" }),
      dataIndex: "year",
      width: 100,
      align: "center",
      filters: [
        ...(dataDistincts?.["planting-schedule-year"] ?? []).map((e: any) => {
          return {
            value: e,
            text: e,
          };
        }),
      ],
    },
    {
      key: "idFarm",
      title: translate({ store, source: "Farm" }),
      width: 200,
      render: (value, record, index) => {
        let farm = record.idFarm && getItemInArray(dataIds?.["farm"] ?? [], record.idFarm, "_id");
        return <div>{farm && (farm?.name ?? "")}</div>;
      },
      filters: [
        {
          text: "Không",
          value: null,
        },
        ...(dataIds?.["farm"] ?? []).map((e: any) => {
          return {
            text: e.name,
            value: e._id,
          };
        }),
      ],
      filterSearch: true,
    },
    {
      key: "idArea",
      title: translate({ store, source: "Area" }),
      width: 200,
      render: (value, record, index) => {
        let area = record.idArea && getItemInArray(dataIds?.["area"] ?? [], record.idArea, "_id");
        return <div>{area && (area?.name ?? "")}</div>;
      },
      filters: [
        ...(dataIds?.["area"] ?? []).map((e: any) => {
          return {
            text: e.name,
            value: e._id,
          };
        }),
      ],
      filterSearch: true,
    },
    {
      key: "idBreed",
      title: translate({ store, source: "Breed" }),
      width: 200,
      render: (value, record, index) => {
        let breed = record.idBreed && getItemInArray(dataIds?.["breed"] ?? [], record.idBreed, "_id");
        return <div>{breed && `${breed?.code} - ${breed?.name}`}</div>;
      },
      filters: [
        ...(dataIds?.["breed"] ?? []).map((e: any) => {
          return {
            text: e.name,
            value: e._id,
          };
        }),
      ],
      filterSearch: true,
    },
    {
      title: translate({ store, source: "Number of seasons" }),
      dataIndex: "numberOfSeasons",
      width: 100,
      align: "center",
    },
    {
      title: translate({ store, source: "Actual number of plants" }),
      dataIndex: "actualNumberOfPlants",
      width: 100,
      align: "center",
    },
    {
      title: translate({ store, source: "Total of plants" }),
      dataIndex: "totalOfPlants",
      width: 100,
      align: "center",
    },
    {
      title: translate({ store, source: "Quantity" }),
      dataIndex: "quantity",
      width: 100,
      align: "center",
    },
    {
      title: translate({ store, source: "Quantity exprected" }),
      dataIndex: "quantityExpected",
      width: 100,
      align: "center",
    },
    {
      title: translate({ store, source: "Comment" }),
      dataIndex: "comment",
      width: 500,
    },
    { title: "", key: "none" },
    {
      key: "status",
      title: translate({ store, source: "Status" }),
      width: 160,
      align: "center",
      fixed: "right",
      render: (value: any, record: any, index: any) => {
        return statusPlan(record);
      },
      filters: [
        {
          text: translate({ store, source: "Kế hoạch" }),
          value: "create",
        },
        {
          text: translate({ store, source: "Đang gieo trồng" }),
          value: "running",
        },
        {
          text: translate({ store, source: "Hủy" }),
          value: "stop",
        },
        {
          text: translate({ store, source: "Đã thu hoạch" }),
          value: "complete",
        },
      ],
    },
  ];

  return (
    <div>
      <PageHeader title="Planting schedule" />
      <div className="page-content">
        <TableView
          model="planting-schedule"
          columnsTable={columns}
          formLayout={({ store, form, onFinish, viewType }) =>
            ViewForm(store, form, onFinish, viewType, dataIds, initSamples, dataDistincts)
          }
          customValuesInit={(values) => {
            if (values.idBreed) {
              let newSamples = (dataIds?.["sample-planting-schedule"] ?? []).filter(
                (e: any) => e.idBreed === values.idBreed
              );
              setInitSamples(newSamples);
            }
            // date start
            let dateStartPlanting = dayjs.unix(values.dateStartPlanting ?? 0);
            // date start production document
            let dateStartProductionDocument = !values.dateStartProductionDocument
              ? null
              : dayjs.unix(values.dateStartProductionDocument);
            // date end production document
            let dateEndProductionDocument = !values.dateEndProductionDocument
              ? null
              : dayjs.unix(values.dateEndProductionDocument);

            let newValues = { ...values, dateStartPlanting, dateStartProductionDocument, dateEndProductionDocument };
            return newValues;
          }}
          customValuesFinish={(values: any) => {
            // date start
            let dateStartPlanting = !values?.dateStartPlanting
              ? dayjs().startOf("day").unix()
              : dayjs(values?.dateStartPlanting).startOf("day").unix();
            // date start production document
            let dateStartProductionDocument = !values?.dateStartProductionDocument
              ? null
              : dayjs(values.dateStartProductionDocument).startOf("day").unix();
            // date end production document
            let dateEndProductionDocument = !values?.dateEndProductionDocument
              ? null
              : dayjs(values.dateEndProductionDocument).startOf("day").unix();

            let newValues = { ...values, dateStartPlanting, dateStartProductionDocument, dateEndProductionDocument };
            return newValues;
          }}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          ids={[
            {
              area: {
                fields: ["_id", "name", "id", "idFarm"],
                filter: { active: true },
              },
            },
            {
              farm: {
                fields: ["_id", "name", "id"],
                filter: { active: true },
              },
            },
            {
              breed: {
                fields: ["_id", "name", "code"],
                filter: { active: true },
              },
            },
            {
              "sample-planting-schedule": {
                fields: ["_id", "name", "idBreed"],
                filter: { active: true },
              },
            },
          ]}
          dataIdsCallback={(value) => setDataIds(value)}
          distincts={[
            {
              "planting-schedule-year": {
                model: "planting-schedule",
                field: "year",
              },
            },
          ]}
          dataDistinctsCallback={(value) => setDataDistincts(value)}
        />
      </div>
    </div>
  );
};

export default Page;
