"use client";
import { StoreContext } from "@/app/components/context-provider";
import DataView from "@/app/components/data-view/data-view";
import app from "@/utils/axios";
import { translate } from "@/utils/translate";
import { App, Avatar, Button, Card, Checkbox, Form, FormInstance, Input, Select, Space } from "antd";
import Meta from "antd/es/card/Meta";
const { Option } = Select;
import { ColumnsType } from "antd/es/table";
import React, { useContext, useState } from "react";

const ViewForm = (
  form: FormInstance<any>,
  onFinish: (value: any) => void,
  viewType: string,
  disabledForm?: boolean,
  dataIds?: any
) => {
  const store = useContext(StoreContext);
  return (
    <Form name="form" form={form} layout="vertical" labelWrap onFinish={onFinish}>
      {/* <Form.Item label="ID" name="id">
        <Input />
      </Form.Item> */}
      <Form.Item
        label="Source Term"
        name="sourceTerm"
        rules={[
          {
            required: true,
            message: translate({ store: store, source: "This field cannot be left blank" }),
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Translate Value"
        name="translationValue"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Locale Code"
        name="localeCode"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <Select
          showSearch
          allowClear
          onClear={() => {
            form.setFieldValue("localeCode", "");
          }}
          filterOption={(input: string, option: any) => {
            return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
          }}
        >
          {(dataIds?.["language"] ?? []).map((e: any) => (
            <Option key={e.localeCode} label={e.name}>
              <span>{e.name}</span>
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        label="Model name"
        name="modelName"
        rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
      >
        <Select
          showSearch
          allowClear
          onClear={() => {
            form.setFieldValue("modelName", "");
          }}
          filterOption={(input: string, option: any) => {
            return (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
          }}
        >
          {(dataIds?.["model"] ?? [])?.map((e: any) => (
            <Option key={e.id} label={e.name}>
              <span>{e.name}</span>
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item label="Active" name="active" valuePropName="checked" initialValue={true}>
        <Checkbox defaultChecked={true}>Active</Checkbox>
      </Form.Item>
    </Form>
  );
};

const Page = () => {
  const [dataIds, setDataIds] = useState<any>();
  const store = useContext(StoreContext);
  const useApp = App.useApp();
  const columns: ColumnsType<any> = [
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   width: 200,
    // },
    {
      title: translate({ store: store, source: "Source term" }),
      dataIndex: "sourceTerm",
      width: 500,
    },
    {
      title: translate({ store: store, source: "Translate Value" }),
      dataIndex: "translationValue",
      width: 500,
    },
    {
      title: translate({ store: store, source: "Locale Code" }),
      dataIndex: "localeCode",
      width: 100,
    },
    {
      title: translate({ store: store, source: "Model Name" }),
      dataIndex: "modelName",
      width: 200,
    },
    { title: "", key: "none" },
    {
      title: translate({ store: store, source: "Active" }),
      width: 100,
      align: "center",
      render: (value: any, record: any, index: number) => {
        return <Checkbox checked={record.active} />;
      },
    },
  ];

  async function uninstallModule(model: string) {
    try {
      const {
        data: { code, message },
      } = await app.post(`/api/module/${model}/uninstall`);

      if (code === 200) {
        useApp.message.success(translate({ store: store, source: "Success" }));
      } else {
        useApp.message.error(translate({ store: store, source: message }));
      }
    } catch (error) {
      useApp.notification.error({ message: "Internal Server Error" });
    }
  }

  async function installModule(model: string) {
    try {
      const {
        data: { code, message },
      } = await app.post(`/api/module/${model}/install`);

      if (code === 200) {
        useApp.message.success(translate({ store: store, source: "Success" }));
      } else {
        useApp.message.error(translate({ store: store, source: message }));
      }
    } catch (error) {
      useApp.notification.error({ message: "Internal Server Error" });
    }
  }

  return (
    <div>
      <DataView
        model="module"
        titleHeader="Module"
        hideActionCreate
        sort={{ name: 1 }}
        renderItemKanban={(value: any, index: number, fetchData?: () => Promise<void>) => (
          <Card
            actions={[
              <Button
                type="primary"
                disabled={value.state === "base"}
                onClick={async () => {
                  if (value.installable) {
                    useApp.modal.confirm({
                      title: "Comfirm",
                      content: "Uninstall module",
                      okText: "Yes",
                      cancelText: "Cancel",
                      onOk: async () => {
                        await uninstallModule(value.id);
                        fetchData && (await fetchData());
                      },
                    });
                  } else {
                    await installModule(value.id);
                    fetchData && (await fetchData());
                  }
                }}
              >
                {value.installable
                  ? translate({ store: store, source: "Uninstall" })
                  : translate({ store: store, source: "Install" })}
              </Button>,
            ]}
          >
            <Meta
              style={{ height: "100px" }}
              avatar={<Avatar src="" />}
              title={translate({ store: store, source: value.name ?? "(Module name)" })}
              description={
                <div className="description-item-module">
                  {translate({ store: store, source: value.description ?? "" })}
                </div>
              }
            />
          </Card>
        )}
      />
    </div>
  );
};

export default Page;
