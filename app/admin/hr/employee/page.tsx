"use client";
import { Checkbox, DatePicker, Form, FormInstance, Input, InputNumber, Select, Space, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useContext, useState } from "react";
import { translate } from "@/utils/translate";
import { StoreContext } from "@/app/components/context-provider";
import TextArea from "antd/es/input/TextArea";
import { StoreApi } from "zustand";
import { StoreApp } from "@/store/store";
import TableView from "@/app/components/data-view/table-view/table-view";
import PageHeader from "@/app/components/body/page-header";
import { filterSearchTable } from "@/app/components/data-view/table-view/filters/filter-search";
import { employeeStatus, genders } from "@/utils/const";
import { getItemInArray } from "@/utils/tool";
import { filterRangeDateUnitTable } from "@/app/components/data-view/table-view/filters/filter-range-date";
import dayjs from "dayjs";

const ViewForm = (
  store: StoreApi<StoreApp>,
  form: FormInstance<any>,
  onFinish: (value: any) => void,
  viewType: string | null,
  dataIds: any
) => {
  return (
    <Form name="form" form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item label={translate({ store, source: "Code" })} name="code">
        <Input />
      </Form.Item>
      <Space>
        <Form.Item label={translate({ store, source: "First name" })} name="firstName">
          <Input />
        </Form.Item>
        <Form.Item label={translate({ store, source: "Last name" })} name="lastName">
          <Input />
        </Form.Item>
      </Space>
      <Form.Item
        label={translate({ store, source: "Full name" })}
        name="fullName"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <Input />
      </Form.Item>
      <Space>
        <Form.Item label={translate({ store, source: "Date of birth" })} name="dateOfBirth">
          <DatePicker format={"DD/MM/YYYY"} />
        </Form.Item>

        <Form.Item label={translate({ store, source: "Gender" })} name="gender">
          <Select style={{ width: 200 }}>
            {...genders.map((e) => <Select.Option key={e.key}>{translate({ source: e.name, store })}</Select.Option>)}
          </Select>
        </Form.Item>
      </Space>

      <Form.Item label={translate({ store, source: "Address" })} name="address">
        <TextArea />
      </Form.Item>
      <Space>
        <Form.Item label={translate({ store, source: "Phone" })} name="phone">
          <Input />
        </Form.Item>
        <Form.Item label={translate({ store, source: "Email" })} name="email">
          <Input />
        </Form.Item>
      </Space>

      <Form.Item label={translate({ store, source: "Department" })} name="idDepartment">
        <Select
          showSearch
          allowClear
          onClear={() => {
            form.setFieldValue("idDepartment", null);
          }}
          filterOption={(input: string, option: any) => {
            return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
          }}
        >
          {(dataIds?.["hr-department"] ?? []).map((e: any) => (
            <Select.Option key={e._id} label={e.name}>
              <span>{e.name}</span>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label={translate({ store, source: "Job position" })} name="idJobPosition">
        <Select
          showSearch
          allowClear
          onClear={() => {
            form.setFieldValue("idJobPosition", null);
          }}
          filterOption={(input: string, option: any) => {
            return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
          }}
        >
          {(dataIds?.["hr-job-position"] ?? []).map((e: any) => (
            <Select.Option key={e._id} label={e.name}>
              <span>{e.name}</span>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label={translate({ store, source: "Salary" })} name="salary">
        <Input />
      </Form.Item>

      <Space>
        <Form.Item label={translate({ store, source: "Hire date" })} name="hireDate">
          <DatePicker format={"DD/MM/YYYY"} />
        </Form.Item>

        <Form.Item label={translate({ store, source: "Termination date" })} name="terminationDate">
          <DatePicker format={"DD/MM/YYYY"} />
        </Form.Item>
      </Space>

      <Form.Item label={translate({ store, source: "Manager" })} name="idEmployeeManager">
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
            <Select.Option key={e._id} label={e.name}>
              <span>{e.name}</span>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label={translate({ store, source: "Employee status" })} name="employeeStatus">
        <Select style={{ width: 200 }}>
          {...employeeStatus.map((e) => (
            <Select.Option key={e.key}>{translate({ source: e.name, store })}</Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label={translate({ store, source: "User" })} name="idUser">
        <Select
          showSearch
          allowClear
          onClear={() => {
            form.setFieldValue("idUser", null);
          }}
          filterOption={(input: string, option: any) => {
            return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
          }}
        >
          {(dataIds?.["user"] ?? []).map((e: any) => (
            <Select.Option key={e._id} label={e.name}>
              <span>{e.name}</span>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label={translate({ store, source: "Org" })} name="idsOrg">
        <Select
          showSearch
          allowClear
          mode="multiple"
          onClear={() => {
            form.setFieldValue("idsOrg", null);
          }}
          filterOption={(input: string, option: any) => {
            return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
          }}
        >
          {(dataIds?.["org"] ?? []).map((e: any) => (
            <Select.Option key={e._id} label={e.name}>
              <span>{e.name}</span>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label={translate({ store, source: "Sequence" })} name="seq" initialValue={100}>
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
      title: translate({ store, source: "Code" }),
      dataIndex: "code",
      width: 160,
      key: "code",
      ...filterSearchTable(),
    },
    {
      title: translate({ store, source: "First name" }),
      dataIndex: "firstName",
      width: 160,
      key: "firstName",
      ...filterSearchTable(),
    },
    {
      title: translate({ store, source: "Last name" }),
      dataIndex: "lastName",
      width: 160,
      key: "lastName",
      ...filterSearchTable(),
    },
    {
      title: translate({ store, source: "Full name" }),
      dataIndex: "fullName",
      width: 200,
      key: "fullName",
      ...filterSearchTable(),
    },
    {
      title: translate({ store, source: "Date of birth" }),
      key: "dateOfBirth",
      dataIndex: "dateOfBirth",
      width: 120,
      align: "center",
      render: (value, record, index) => {
        return <>{record.dateOfBirth && dayjs.unix(record.dateOfBirth).format("DD/MM/YYYY")}</>;
      },
    },
    {
      title: translate({ store, source: "Gender" }),
      dataIndex: "gender",
      width: 200,
      key: "gender",
      render: (value, record, index) => {
        return <>{(record.gender && getItemInArray(genders ?? [], record.gender, "key")?.name) ?? ""}</>;
      },
    },
    {
      title: translate({ store, source: "Address" }),
      dataIndex: "address",
      width: 300,
      key: "address",
    },
    {
      title: translate({ store, source: "Phone" }),
      dataIndex: "phone",
      width: 120,
      align: "center",
      key: "phone",
    },
    {
      title: translate({ store, source: "Email" }),
      dataIndex: "email",
      width: 200,
      key: "email",
    },
    {
      title: translate({ store, source: "Job position" }),
      dataIndex: "idJobPosition",
      width: 200,
      key: "idJobPosition",
      render: (value, record, index) => {
        return (
          <>
            {(record.idJobPosition &&
              getItemInArray(dataIds?.["hr-job-position"] ?? [], record.idJobPosition, "_id")?.name) ??
              ""}
          </>
        );
      },
    },
    {
      title: translate({ store, source: "Department" }),
      dataIndex: "idDepartment",
      width: 200,
      key: "idDepartment",
      render: (value, record, index) => {
        return (
          <>
            {(record.idDepartment &&
              getItemInArray(dataIds?.["hr-department"] ?? [], record.idDepartment, "_id")?.name) ??
              ""}
          </>
        );
      },
    },
    {
      title: translate({ store, source: "Salary" }),
      dataIndex: "salary",
      width: 100,
      key: "salary",
    },
    {
      title: translate({ store, source: "Hire date" }),
      width: 120,
      align: "center",
      render: (value: any, record: any, index: number) => {
        return <>{record.hireDate && dayjs.unix(record.hireDate).format("DD/MM/YYYY")}</>;
      },
      dataIndex: "hireDate",
      key: "hireDate",
      sorter: true,
      ...filterRangeDateUnitTable({}),
    },
    {
      title: translate({ store, source: "Termination date" }),
      width: 120,
      align: "center",
      render: (value: any, record: any, index: number) => {
        return <>{record.terminationDate && dayjs.unix(record.terminationDate).format("DD/MM/YYYY")}</>;
      },
      dataIndex: "terminationDate",
      key: "terminationDate",
      sorter: true,
      ...filterRangeDateUnitTable({}),
    },
    {
      title: translate({ store, source: "Manager" }),
      dataIndex: "idEmployeeManager",
      width: 200,
      key: "idEmployeeManager",
      render: (value, record, index) => {
        return (
          <>
            {(record.idEmployeeManager &&
              getItemInArray(dataIds?.["hr-department"] ?? [], record.idEmployeeManager, "_id")?.name) ??
              ""}
          </>
        );
      },
    },
    {
      title: translate({ store, source: "User" }),
      dataIndex: "idUser",
      width: 200,
      key: "idUser",
      render: (value, record, index) => {
        let user = getItemInArray(dataIds?.["user"] ?? [], record.idUser, "_id");
        return <>{user?.name ?? user?.username ?? ""}</>;
      },
    },
    {
      title: translate({ store, source: "Org" }),
      dataIndex: "idsOrg",
      width: 500,
      key: "idsOrg",
      render: (value, record, index) => {
        if (Array.isArray(record.idsOrg)) {
          return (
            <Space wrap>
              {...record.idsOrg.map((e: any) => {
                return <Tag>{getItemInArray(dataIds?.["org"] ?? [], e, "_id")?.name ?? ""}</Tag>;
              })}
            </Space>
          );
        }
        return <></>;
      },
    },
    { title: "", key: "none" },
    {
      title: translate({ store, source: "Employee status" }),
      dataIndex: "employeeStatus",
      key: "employeeStatus",
      width: 140,
      fixed: "right",
      align: "center",
      render: (value, record, index) => {
        let status = getItemInArray(employeeStatus, record.employeeStatus, "key");
        return <Tag color={status.color}>{(status && status?.name) ?? ""}</Tag>;
      },
      filters: [
        ...employeeStatus.map((e) => {
          return {
            text: translate({ source: e.name, store }),
            value: e.key,
          };
        }),
      ],
    },
  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  return (
    <div>
      <PageHeader title="Employee" />
      <div className="page-content">
        <TableView
          model={"hr-employee"}
          columnsTable={columns}
          sort={{ seq: 1 }}
          formLayout={({ store, form, onFinish, viewType }) => ViewForm(store, form, onFinish, viewType, dataIds)}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          customValuesInit={(values: any) => {
            // date of birth
            let dateOfBirth = values.dateOfBirth ? dayjs.unix(values.dateOfBirth ?? 0) : null;
            // hire date
            let hireDate = values.hireDate ? dayjs.unix(values.hireDate ?? 0) : null;
            // termination date
            let terminationDate = values.terminationDate ? dayjs.unix(values.terminationDate ?? 0) : null;

            let newValues = { ...values, dateOfBirth, hireDate, terminationDate };
            return newValues;
          }}
          customValuesFinish={(values: any) => {
            // date of birth
            let dateOfBirth = values?.dateOfBirth ? dayjs(values?.dateOfBirth).startOf("day").unix() : null;
            // hire date
            let hireDate = values?.hireDate ? dayjs(values?.hireDate).startOf("day").unix() : null;
            // termination date
            let terminationDate = values?.terminationDate ? dayjs(values?.terminationDate).startOf("day").unix() : null;
            let newValues = { ...values, dateOfBirth, hireDate, terminationDate };
            return newValues;
          }}
          ids={[
            {
              "hr-job-position": {
                fields: ["_id", "name"],
                filter: { active: true },
                sort: { seq: 1 },
              },
            },
            {
              "hr-department": {
                fields: ["_id", "name"],
                filter: { active: true },
                sort: { seq: 1 },
              },
            },
            {
              "hr-employee": {
                fields: ["_id", "fullName"],
                filter: { active: true },
                sort: { seq: 1 },
              },
            },
            {
              user: {
                fields: ["_id", "name", "username"],
                filter: { active: true },
              },
            },
            {
              org: {
                fields: ["_id", "name"],
                filter: { active: true },
                sort: { seq: 1 },
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
