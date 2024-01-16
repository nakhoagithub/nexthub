"use client";
import DataView from "@/app/components/data-view/data-view";
import { Button, Checkbox, Form, FormInstance, Input, Select, Tabs } from "antd";
const { Option } = Select;
import { ColumnsType } from "antd/es/table";
import React, { useContext, useState } from "react";
import ModalChangePassword from "./components/modal-change-password";
import One2ManyView from "@/app/components/data-view/o2m-view/o2m-view";
import { userStates } from "@/utils/config";
import { getItemInArray } from "@/utils/tool";
import { translate } from "@/utils/translate";
import { StoreContext } from "@/app/components/context-provider";
import { StoreApi } from "zustand";
import { StoreApp } from "@/store/store";
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
      <Form.Item label="Name" name="name">
        <Input />
      </Form.Item>
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <Input disabled={viewType === "update"} />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <Input.Password disabled={viewType === "update"} />
      </Form.Item>

      <Form.Item
        label="State"
        name="state"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
        initialValue={"user"}
      >
        <Select>
          {...userStates.map((e) => (
            <Option key={e.key}>
              <span>{e.name}</span>
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Origanization" name="idsOrg">
        <Select mode="multiple">
          {...(dataIds?.["org"] ?? []).map((e: any) => (
            <Option key={e._id}>
              <span>{e.name}</span>
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Locale Code" name="localeCode">
        <Select>
          {...(dataIds?.["language"] ?? []).map((e: any) => (
            <Option key={e.localeCode}>
              <span>{e.name}</span>
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Active" name="active" valuePropName="checked" initialValue={true}>
        <Checkbox defaultChecked={true}>Active</Checkbox>
      </Form.Item>

      {/* <Tabs
        type="card"
        items={[
          {
            forceRender: true,
            label: "Org",
            key: "org",
            children: (
              <One2ManyView
                showAdd
                idsField="idsOrg"
                titleModel="Org"
                model="user"
                toModel="org"
                columnsTable={columnsOrg}
                form={form}
              />
            ),
          },
        ]}
      /> */}
    </Form>
  );
};

const Page = () => {
  const store = useContext(StoreContext);
  const [openModalChangePassword, setOpenModalChangePassword] = useState(false);
  const [idUser, setIdUser] = useState<string>();
  const [dataIds, setDataIds] = useState<any>();

  const columns: ColumnsType<any> = [
    {
      title: "Name",
      dataIndex: "name",
      width: 160,
    },
    {
      title: "Username",
      dataIndex: "username",
      width: 160,
    },
    { title: "", key: "none" },
    {
      title: "Locale Code",
      width: 200,
      render: (value, record, index) => {
        return <div>{getItemInArray(dataIds?.["language"] ?? [], record.localeCode, "localeCode")?.name ?? ""}</div>;
      },
    },
    {
      title: "State",
      width: 200,
      render: (value, record, index) => {
        return <div>{getItemInArray(userStates, record.state, "key").name}</div>;
      },
    },
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
      <PageHeader title={translate({ store, source: "User" })} />
      <div className="page-content">
        <ModalChangePassword open={openModalChangePassword} setOpen={setOpenModalChangePassword} id={idUser} />
        <TableView
          model={"user"}
          columnsTable={columns}
          formLayout={({ store, form, onFinish, viewType }) => ViewForm(store, form, onFinish, viewType, dataIds)}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          updateField="username"
          ids={[
            {
              language: {
                fields: ["localeCode", "name"],
                filter: { active: true },
              },
            },
            {
              org: {
                fields: ["_id", "name"],
                filter: { active: true },
              },
            },
          ]}
          dataIdsCallback={(value) => setDataIds(value)}
          actions={(keys?: any[]) => [
            <div>
              {keys?.length === 1 && (
                <Button
                  onClick={() => {
                    setOpenModalChangePassword(true);
                    setIdUser(keys[0]);
                  }}
                >
                  Change Password
                </Button>
              )}
            </div>,
          ]}
        />
      </div>
    </div>
  );
};

export default Page;
