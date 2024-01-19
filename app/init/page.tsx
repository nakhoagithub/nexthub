"use client";
import React, { useContext } from "react";
import { StoreContext } from "../components/context-provider";
import { App, Button, Form, Input } from "antd";
import app from "@/utils/axios";
import { useRouter } from "next/navigation";
import { apiResultCode } from "@/utils/tool";

const Page = () => {
  const useApp = App.useApp();
  const router = useRouter();
  const store = useContext(StoreContext);
  const { login } = store.getState();
  const onFinish = async (values: any) => {
    try {
      const {
        data: { data, code },
      } = await app.post(`/api/user/create-master`, { ...values });
      if (code === 200) {
        router.push("/login");
      }
    } catch (error) {
      let { message, content } = apiResultCode({ error: error, store });
      useApp.notification.error({ message: message, description: content });
    }
  };

  const onFinishFailed = (errorInfo: any) => {};

  return (
    <div className="login-page">
      <div className="login-title">Initial user Admin</div>
      <Form
        name="init"
        layout="vertical"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        style={{ width: 400 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input placeholder="Username" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Init
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Page;
