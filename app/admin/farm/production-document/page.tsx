"use client";
import { Button, Checkbox, DatePicker, Form, FormInstance, Input, InputNumber, Select, Space, Tabs } from "antd";
const { Option } = Select;
import { ColumnsType } from "antd/es/table";
import React, { useContext, useState } from "react";
import { translate } from "@/utils/translate";
import { StoreContext } from "@/app/components/context-provider";
import TextArea from "antd/es/input/TextArea";
import { StoreApi } from "zustand";
import { StoreApp } from "@/store/store";
import { getItemInArray } from "@/utils/tool";
import PageHeader from "@/app/components/body/page-header";
import dayjs from "dayjs";
import TableView from "@/app/components/data-view/table-view/table-view";
import { filterSearchTable } from "@/app/components/data-view/table-view/filters/filter-search";
import { filterRangeDateUnitTable } from "@/app/components/data-view/table-view/filters/filter-range-date";
import { filterModelTable } from "@/app/components/data-view/table-view/filters/filter-model";
import { EditOutlined } from "@ant-design/icons";
import ModalEditorContent from "./components/modal-edit-content";

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
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [dataIds, setDataIds] = useState<any>();
  const [openEditContent, setOpenEditContent] = useState(false);
  const [dataContent, setDataContent] = useState<any>();
  const [keyContent, setKeyContent] = useState<string>("");

  const columns: ColumnsType<any> = [
    {
      title: translate({ store, source: "Season code" }),
      dataIndex: "codePlantingSchedule",
      width: 200,
      fixed: "left",
      ...filterSearchTable(),
    },
    {
      title: translate({ store, source: "Date" }),
      width: 120,
      align: "center",
      render: (value: any, record: any, index: number) => {
        return <>{record.dateUnix && dayjs.unix(record.dateUnix).format("DD/MM/YYYY")}</>;
      },
      fixed: "left",
      dataIndex: "dateUnix",
      sorter: true,
      ...filterRangeDateUnitTable({}),
    },
    {
      title: translate({ store, source: "Area" }),
      width: 200,
      render: (value, record, index) => {
        let area = record.idArea && getItemInArray(dataIds?.["area"] ?? [], record.idArea, "_id");
        return <div>{area && `${area?.name ?? ""}`}</div>;
      },
      dataIndex: "idArea",
      ...filterModelTable({
        model: "area",
        searchKeys: ["name", "id"],
        fields: ["name"],
        keyView: "name",
        keySelect: "_id",
      }),
    },
    {
      title: translate({ store, source: "Work diary" }),
      dataIndex: "contentWorkDiary",
      width: 500,
      render: (value, record, index) => {
        return (
          <div>
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => {
                setDataContent(record);
                setKeyContent("contentWorkDiary");
                setOpenEditContent(true);
              }}
            />
            <div style={{ margin: 8 }} dangerouslySetInnerHTML={{ __html: record.contentWorkDiary ?? "" }} />
          </div>
        );
      },
    },
    {
      title: translate({ store, source: "Garden check diary" }),
      dataIndex: "contentGardenCheckDiary",
      width: 500,
      render: (value, record, index) => {
        return (
          <div>
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => {
                setDataContent(record);
                setKeyContent("contentGardenCheckDiary");
                setOpenEditContent(true);
              }}
            />
            <div style={{ margin: 8 }} dangerouslySetInnerHTML={{ __html: record.contentGardenCheckDiary ?? "" }} />
          </div>
        );
      },
    },
    {
      title: translate({ store, source: "Disease management" }),
      dataIndex: "contentDiseaseManagement",
      width: 500,
      render: (value, record, index) => {
        return (
          <div>
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => {
                setDataContent(record);
                setKeyContent("contentDiseaseManagement");
                setOpenEditContent(true);
              }}
            />
            <div style={{ margin: 8 }} dangerouslySetInnerHTML={{ __html: record.contentDiseaseManagement ?? "" }} />
          </div>
        );
      },
    },
    { title: "", key: "none" },
  ];

  return (
    <div>
      <ModalEditorContent
        open={openEditContent}
        setOpen={setOpenEditContent}
        data={dataContent}
        keyData={keyContent}
        model="production-document"
      />
      <PageHeader title="Production document" />
      <div className="page-content">
        <TableView
          model={"production-document"}
          columnsTable={columns}
          formLayout={({ store, form, onFinish, viewType }) => ViewForm(store, form, onFinish, viewType, dataIds)}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          pageSize={20}
          ids={[
            {
              area: {
                fields: ["_id", "name"],
                filter: { active: true },
              },
            },
          ]}
          dataIdsCallback={(value) => setDataIds(value)}
          hideActionCreate
          hideActionUpdate
          hideActionDelete
        />
      </div>
    </div>
  );
};

export default Page;
