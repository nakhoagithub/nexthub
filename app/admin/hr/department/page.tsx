"use client";
import { Checkbox, Form, FormInstance, Input, InputNumber, Select } from "antd";
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
        label={translate({ store, source: "Name" })}
        name="name"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <Input />
      </Form.Item>
      <Form.Item label={translate({ store, source: "Description" })} name="description">
        <TextArea />
      </Form.Item>

      <Form.Item label={translate({ store, source: "Employee manager" })} name="idEmployeeManager">
        <Select
          showSearch
          allowClear
          onClear={() => {
            form.setFieldValue("idEmployeeManager", null);
          }}
          filterOption={(input: string, option: any) => {
            return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
          }}
        >
          {(dataIds?.["hr-employee"] ?? []).map((e: any) => (
            <Option key={e._id} label={e.fullName}>
              <span>{e.fullName}</span>
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label={translate({ store, source: "Location" })} name="location">
        <Input />
      </Form.Item>

      <Form.Item label={translate({ store, source: "Budget" })} name="budget">
        <Input />
      </Form.Item>

      <Form.Item label={translate({ store, source: "Sequence" })} name="seq">
        <InputNumber />
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
      title: translate({ store, source: "Name" }),
      dataIndex: "name",
      width: 160,
      key: "name",
      ...filterSearchTable(),
    },
    {
      title: translate({ store, source: "Description" }),
      key: "desciption",
      width: 300,
      dataIndex: "desciption",
    },
    {
      title: translate({ store, source: "Employee manager" }),
      width: 200,
      render: (value, record, index) => {
        return (
          <>
            {(record.idEmployeeManager &&
              getItemInArray(dataIds?.["hr-employee"] ?? [], record.idEmployeeManager, "_id")?.name) ??
              ""}
          </>
        );
      },
      dataIndex: "idEmployeeManager",
      key: "idEmployeeManager",
      ...filterModelTable({
        fields: ["fullName"],
        keySelect: "_id",
        keyView: "fullName",
        model: "hr-employee",
        searchKeys: ["fullName"],
      }),
    },
    {
      title: translate({ store, source: "Location" }),
      dataIndex: "location",
      width: 300,
      key: "location",
      ...filterSearchTable(),
    },
    {
      title: translate({ store, source: "Employees count" }),
      dataIndex: "employeesCount",
      width: 100,
      key: "employeesCount",
      align: "center",
    },
    {
      title: translate({ store, source: "Budget" }),
      dataIndex: "budget",
      width: 300,
      key: "budget",
      ...filterSearchTable(),
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
      <PageHeader title="Department" />
      <div className="page-content">
        <TableView
          model={"hr-department"}
          columnsTable={columns}
          sort={{ seq: 1 }}
          formLayout={({ store, form, onFinish, viewType }) => ViewForm(store, form, onFinish, viewType, dataIds)}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          ids={[
            {
              "hr-employee": {
                fields: ["_id", "fullName"],
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
