"use client";
import { Checkbox, Form, FormInstance, Input, InputNumber } from "antd";
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

      <Form.Item label={translate({ store, source: "Salary range" })} name="salaryRange">
        <Input />
      </Form.Item>

      <Form.Item label={translate({ store, source: "Responsibilities" })} name="responsibilities">
        <TextArea />
      </Form.Item>

      <Form.Item label={translate({ store, source: "Requirements" })} name="requirements">
        <TextArea />
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
      title: translate({ store, source: "Salary range" }),
      dataIndex: "salaryRange",
      width: 200,
      key: "salaryRange",
    },
    {
      title: translate({ store, source: "Responsibilities" }),
      dataIndex: "responsibilities",
      width: 500,
      key: "responsibilities",
    },
    {
      title: translate({ store, source: "Requirements" }),
      dataIndex: "requirements",
      width: 500,
      key: "requirements",
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
      <PageHeader title="Job position" />
      <div className="page-content">
        <TableView
          model={"hr-job-position"}
          columnsTable={columns}
          sort={{ seq: 1 }}
          formLayout={({ store, form, onFinish, viewType }) => ViewForm(store, form, onFinish, viewType, dataIds)}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          dataIdsCallback={(value) => setDataIds(value)}
        />
      </div>
    </div>
  );
};

export default Page;
