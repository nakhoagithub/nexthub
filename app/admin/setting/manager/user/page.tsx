"use client";
import DataView from "@/app/components/data-view/data-view";
import { Button, Checkbox, Form, FormInstance, Input, Select, Tabs } from "antd";
const { Option } = Select;
import { ColumnsType } from "antd/es/table";
import React, { useState } from "react";
import ModalChangePassword from "./components/modal-change-password";
import One2ManyView from "@/app/components/data-view/o2m-view/o2m-view";
import { userStates } from "@/utils/config";
import { getItemInArray } from "@/utils/tool";
import { translate } from "@/utils/translate";

const ViewForm = (form: FormInstance<any>, onFinish: (value: any) => void, viewType: string, dataIds: any) => {
  const columnsOrg: ColumnsType<any> = [
    {
      title: "Name",
      dataIndex: "name",
      width: 200,
      key: "name",
    },
    {
      title: "Short name",
      dataIndex: "shortName",
      width: 160,
      key: "name",
    },
    {
      title: "",
      key: "none",
    },
  ];

  return (
    <Form name="form" form={form} layout="vertical" style={{ width: 600 }} onFinish={onFinish}>
      <Form.Item label="Name" name="name">
        <Input />
      </Form.Item>
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: translate({ source: "This field cannot be left blank" }) }]}
      >
        <Input disabled={viewType === "update"} />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: translate({ source: "This field cannot be left blank" }) }]}
      >
        <Input.Password disabled={viewType === "update"} />
      </Form.Item>

      <Form.Item
        label="State"
        name="state"
        rules={[{ required: true, message: translate({ source: "This field cannot be left blank" }) }]}
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

      <Tabs
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
      />
    </Form>
  );
};

const Page = () => {
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
        return <div>{getItemInArray(dataIds?.["language"] ?? [], record.localeCode, "localeCode").name}</div>;
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

  return (
    <div>
      <ModalChangePassword open={openModalChangePassword} setOpen={setOpenModalChangePassword} id={idUser} />
      <DataView
        model="user"
        titleHeader="User"
        columnsTable={columns}
        tableBoder={true}
        formLayout={(form, onFinish, viewType) => ViewForm(form, onFinish, viewType, dataIds)}
        updateField="username"
        ids={[
          {
            language: {
              fields: ["localeCode", "name"],
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
  );
};

export default Page;
